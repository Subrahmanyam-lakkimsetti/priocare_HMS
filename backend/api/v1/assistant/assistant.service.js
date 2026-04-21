const mongoose = require('mongoose');
const Appointment = require('../../../models/appointment.model');
const AssistantConversation = require('../../../models/assistantConversation.model');
const Doctor = require('../../../models/doctor.model');
const Patient = require('../../../models/patient.model');
const Prescription = require('../../../models/prescription.model');
const AppError = require('../../../utils/AppError.util');
const { aiClient } = require('../../../utils/aiClient');
const { prompt } = require('./prompts/patientAssistant.prompt');
const {
  prompt: intakeAutofillPrompt,
} = require('./prompts/intakeAutofill.prompt');
const {
  prompt: intakeAutofillChatPrompt,
} = require('./prompts/intakeAutofillChat.prompt');

const ACTIVE_APPOINTMENT_STATUSES = [
  'confirmed',
  'checked_in',
  'called',
  'in_consultation',
];

const RISK_KEYWORDS = [
  'chest pain',
  'breathing',
  'bleeding',
  'unconscious',
  'fainted',
  'stroke',
  'heart attack',
  'seizure',
  'suicidal',
  'severe pain',
  'cannot breathe',
];

const getPatientByUserId = async (userId) => {
  const patient = await Patient.findOne({ userId });

  if (!patient) {
    throw new AppError('Patient profile does not found', 404);
  }

  return patient;
};

const normalizeConfidence = (value) => {
  const asNumber = Number(value);

  if (Number.isNaN(asNumber)) {
    return 0.45;
  }

  if (asNumber > 1) {
    return Math.max(0, Math.min(1, asNumber / 100));
  }

  return Math.max(0, Math.min(1, asNumber));
};

const cleanJsonText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return '{}';
  }

  return rawText
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
};

const defaultAiResponse = () => ({
  answer:
    'I can help with hospital guidance, appointment details, and intake support. For diagnosis or treatment decisions, please consult your doctor.',
  confidence: 0.45,
  requiresEscalation: true,
  escalationReason: 'Low confidence response generated.',
  safetyNotice: 'For urgent symptoms, contact emergency services immediately.',
});

const defaultAutofillResponse = () => ({
  description: null,
  symptoms: [],
  comorbidities: [],
  vitals: {
    heartRate: null,
    bloodPressure: null,
    temperature: null,
  },
  age: null,
});

const buildActiveAppointmentContext = async (patientId) => {
  const appointment = await Appointment.findOne({
    patientId,
    status: { $in: ACTIVE_APPOINTMENT_STATUSES },
  })
    .populate('doctorId', 'firstName lastName department')
    .sort({ scheduledDate: -1 });

  if (!appointment) {
    return null;
  }

  const prescription = await Prescription.findOne({
    appointmentId: appointment._id,
  }).select('diagnosis medications notes followUpDate');

  return {
    appointment,
    prescription,
  };
};

const getConversation = async ({
  patientId,
  conversationId,
  appointmentId,
}) => {
  if (conversationId) {
    const existingConversation =
      await AssistantConversation.findById(conversationId);

    if (!existingConversation) {
      throw new AppError('Conversation not found', 404);
    }

    if (!existingConversation.patientId.equals(patientId)) {
      throw new AppError('Unauthorized conversation access', 401);
    }

    return existingConversation;
  }

  return AssistantConversation.create({
    patientId,
    appointmentId: appointmentId || null,
    messages: [],
    status: 'open',
    lastMessageAt: new Date(),
  });
};

const getExplicitAppointmentContext = async (patientId, appointmentId) => {
  if (!appointmentId) {
    return null;
  }

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    patientId,
  }).populate('doctorId', 'firstName lastName department');

  if (!appointment) {
    throw new AppError('Appointment not found for patient', 404);
  }

  const prescription = await Prescription.findOne({
    appointmentId: appointment._id,
  }).select('diagnosis medications notes followUpDate');

  return {
    appointment,
    prescription,
  };
};

const buildPromptWithContext = ({
  question,
  patient,
  conversation,
  appointmentContext,
  intent,
  pageContext,
  currentIntake,
}) => {
  const lastMessages = (conversation.messages || []).slice(-6).map((msg) => ({
    role: msg.role,
    content: msg.content,
    createdAt: msg.createdAt,
  }));

  const safeContext = {
    patient: {
      age: patient.age,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
    },
    appointment: appointmentContext?.appointment
      ? {
          token: appointmentContext.appointment.token,
          status: appointmentContext.appointment.status,
          scheduledDate: appointmentContext.appointment.scheduledDate,
          doctorName: appointmentContext.appointment.doctorId
            ? `${appointmentContext.appointment.doctorId.firstName || ''} ${appointmentContext.appointment.doctorId.lastName || ''}`.trim()
            : null,
          department:
            appointmentContext.appointment.doctorId?.department || null,
          triage: appointmentContext.appointment.triage || null,
        }
      : null,
    prescription: appointmentContext?.prescription || null,
    conversationWindow: lastMessages,
    intent: intent || 'general',
    pageContext: pageContext || 'unknown',
    intake: currentIntake || null,
  };

  return `${prompt}

Context JSON:
${JSON.stringify(safeContext, null, 2)}

Patient question:
${question}`;
};

const parseAssistantResponse = (rawResponse) => {
  try {
    const parsed = JSON.parse(cleanJsonText(rawResponse));

    return {
      answer:
        parsed.answer ||
        'I can help with appointment, intake, and hospital process questions.',
      confidence: normalizeConfidence(parsed.confidence),
      requiresEscalation: Boolean(parsed.requiresEscalation),
      escalationReason: parsed.escalationReason || null,
      safetyNotice:
        parsed.safetyNotice ||
        'This assistant does not provide diagnosis or treatment decisions.',
    };
  } catch (error) {
    return defaultAiResponse();
  }
};

const shouldEscalateByQuestion = (question) => {
  const normalizedQuestion = String(question || '').toLowerCase();

  return RISK_KEYWORDS.some((keyword) => normalizedQuestion.includes(keyword));
};

const askAssistant = async (userId, payload) => {
  const {
    question,
    conversationId,
    appointmentId,
    intent,
    pageContext,
    currentIntake,
  } = payload;

  const patient = await getPatientByUserId(userId);

  const selectedAppointmentContext = appointmentId
    ? await getExplicitAppointmentContext(patient._id, appointmentId)
    : await buildActiveAppointmentContext(patient._id);

  const conversation = await getConversation({
    patientId: patient._id,
    conversationId,
    appointmentId: selectedAppointmentContext?.appointment?._id || null,
  });

  conversation.messages.push({
    role: 'patient',
    content: question,
    intent: intent || 'general',
    meta: {
      pageContext: pageContext || null,
    },
    createdAt: new Date(),
  });

  const assistantPrompt = buildPromptWithContext({
    question,
    patient,
    conversation,
    appointmentContext: selectedAppointmentContext,
    intent,
    pageContext,
    currentIntake,
  });

  let aiResponse;

  try {
    const rawAiResponse = await aiClient(assistantPrompt);
    aiResponse = parseAssistantResponse(rawAiResponse);
  } catch (error) {
    aiResponse = {
      ...defaultAiResponse(),
      answer:
        'Priocare Assistant is temporarily unavailable due to AI service load. Please try again shortly or request staff assistance.',
      escalationReason:
        'AI provider unavailable (rate limit or upstream error).',
      requiresEscalation: true,
      confidence: 0.25,
    };
  }

  const keywordEscalation = shouldEscalateByQuestion(question);
  const lowConfidenceEscalation = aiResponse.confidence < 0.6;
  const shouldEscalate =
    Boolean(aiResponse.requiresEscalation) ||
    keywordEscalation ||
    lowConfidenceEscalation;

  const escalationReason =
    aiResponse.escalationReason ||
    (keywordEscalation
      ? 'Risk keywords detected in patient query.'
      : lowConfidenceEscalation
        ? 'Assistant response confidence is low.'
        : null);

  conversation.messages.push({
    role: 'assistant',
    content: aiResponse.answer,
    intent: intent || 'general',
    confidence: aiResponse.confidence,
    safetyNotice: aiResponse.safetyNotice,
    meta: {
      requiresEscalation: shouldEscalate,
      escalationReason,
    },
    createdAt: new Date(),
  });

  if (shouldEscalate) {
    conversation.status = 'escalated';
    conversation.escalation = {
      isEscalated: true,
      reason: escalationReason || 'Assistant flagged escalation.',
      targetRole: selectedAppointmentContext?.appointment
        ? 'doctor'
        : 'receptionist',
      escalatedAt: new Date(),
    };
  }

  conversation.lastMessageAt = new Date();

  if (
    !conversation.appointmentId &&
    selectedAppointmentContext?.appointment?._id
  ) {
    conversation.appointmentId = selectedAppointmentContext.appointment._id;
  }

  await conversation.save();

  return {
    conversationId: conversation._id,
    status: conversation.status,
    answer: aiResponse.answer,
    confidence: aiResponse.confidence,
    requiresEscalation: shouldEscalate,
    escalationReason,
    safetyNotice: aiResponse.safetyNotice,
  };
};

const getConversationById = async (userId, conversationId) => {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new AppError('Invalid conversation id', 400);
  }

  const patient = await getPatientByUserId(userId);

  const conversation = await AssistantConversation.findById(conversationId)
    .populate('appointmentId', 'token status scheduledDate')
    .sort({ lastMessageAt: -1 });

  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  if (!conversation.patientId.equals(patient._id)) {
    throw new AppError('Unauthorized conversation access', 401);
  }

  return conversation;
};

const escalateConversation = async (userId, payload) => {
  const { conversationId, reason, targetRole } = payload;

  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new AppError('Invalid conversation id', 400);
  }

  const patient = await getPatientByUserId(userId);

  const conversation = await AssistantConversation.findById(conversationId);

  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  if (!conversation.patientId.equals(patient._id)) {
    throw new AppError('Unauthorized conversation access', 401);
  }

  conversation.status = 'escalated';
  conversation.escalation = {
    isEscalated: true,
    reason,
    targetRole,
    escalatedAt: new Date(),
  };
  conversation.lastMessageAt = new Date();

  await conversation.save();

  return conversation;
};

const getAppointmentContext = async (userId, appointmentId) => {
  const patient = await getPatientByUserId(userId);

  const selectedContext = appointmentId
    ? await getExplicitAppointmentContext(patient._id, appointmentId)
    : await buildActiveAppointmentContext(patient._id);

  if (!selectedContext) {
    return null;
  }

  return {
    appointment: selectedContext.appointment,
    prescription: selectedContext.prescription,
  };
};

const buildAutofillPrompt = ({
  description,
  symptoms,
  comorbidities,
  vitals,
  age,
}) => {
  const context = {
    description: description || null,
    symptoms: Array.isArray(symptoms) ? symptoms : [],
    comorbidities: Array.isArray(comorbidities) ? comorbidities : [],
    vitals: vitals || {},
    age: age || null,
  };

  return `${intakeAutofillPrompt}

Context JSON:
${JSON.stringify(context, null, 2)}`;
};

const buildAutofillChatPrompt = ({ messages, currentIntake }) => {
  const transcript = Array.isArray(messages)
    ? messages
        .slice(-12)
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join('\n')
    : '';
  const context = currentIntake || {};

  return `${intakeAutofillChatPrompt}

Current intake JSON:
${JSON.stringify(context, null, 2)}

Conversation transcript:
${transcript}`;
};

const parseAutofillResponse = (rawText) => {
  try {
    const parsed = JSON.parse(cleanJsonText(rawText));

    return {
      description: parsed.description || null,
      symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : [],
      comorbidities: Array.isArray(parsed.comorbidities)
        ? parsed.comorbidities
        : [],
      vitals: {
        heartRate: parsed.vitals?.heartRate || null,
        bloodPressure: parsed.vitals?.bloodPressure || null,
        temperature: parsed.vitals?.temperature || null,
      },
      age: parsed.age || null,
    };
  } catch (error) {
    return defaultAutofillResponse();
  }
};

const getIntakeAutofill = async (userId, payload) => {
  await getPatientByUserId(userId);

  const promptText = buildAutofillPrompt(payload || {});

  try {
    const raw = await aiClient(promptText);
    return parseAutofillResponse(raw);
  } catch (error) {
    return {
      ...defaultAutofillResponse(),
      error: 'AI provider unavailable. Please try again later.',
    };
  }
};

const getIntakeAutofillFromChat = async (userId, payload) => {
  await getPatientByUserId(userId);

  const promptText = buildAutofillChatPrompt(payload || {});

  try {
    const raw = await aiClient(promptText);
    return parseAutofillResponse(raw);
  } catch (error) {
    return {
      ...defaultAutofillResponse(),
      error: 'AI provider unavailable. Please try again later.',
    };
  }
};

const deleteConversation = async (userId, conversationId) => {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new AppError('Invalid conversation id', 400);
  }

  const patient = await getPatientByUserId(userId);
  const conversation = await AssistantConversation.findById(conversationId);

  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  if (!conversation.patientId.equals(patient._id)) {
    throw new AppError('Unauthorized conversation access', 401);
  }

  await AssistantConversation.deleteOne({ _id: conversationId });
};

const listPatientConversations = async (userId, query = {}) => {
  const patient = await getPatientByUserId(userId);

  const limit = Math.max(1, Math.min(50, Number(query.limit) || 10));
  const filter = {
    patientId: patient._id,
  };

  if (query.status && ['open', 'escalated', 'closed'].includes(query.status)) {
    filter.status = query.status;
  }

  const conversations = await AssistantConversation.find(filter)
    .populate('appointmentId', 'token status scheduledDate')
    .sort({ lastMessageAt: -1 })
    .limit(limit);

  return conversations.map((conversation) => {
    const messages = conversation.messages || [];
    const lastMessage = messages[messages.length - 1] || null;

    return {
      _id: conversation._id,
      status: conversation.status,
      appointmentId: conversation.appointmentId,
      escalation: conversation.escalation,
      lastMessageAt: conversation.lastMessageAt,
      preview: lastMessage
        ? {
            role: lastMessage.role,
            content: String(lastMessage.content || '').slice(0, 180),
            createdAt: lastMessage.createdAt,
          }
        : null,
    };
  });
};

const getEscalationInbox = async (userData, query = {}) => {
  const { id: userId, role } = userData;
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));

  const baseFilter = {
    status: 'escalated',
    'escalation.isEscalated': true,
  };

  if (role === 'doctor') {
    baseFilter['escalation.targetRole'] = 'doctor';
  }

  if (role === 'receptionist') {
    baseFilter['escalation.targetRole'] = 'receptionist';
  }

  const conversations = await AssistantConversation.find(baseFilter)
    .populate('patientId', 'firstName lastName age gender')
    .populate({
      path: 'appointmentId',
      select: 'token status scheduledDate doctorId',
      populate: {
        path: 'doctorId',
        select: 'firstName lastName department userId',
      },
    })
    .sort({ lastMessageAt: -1 })
    .limit(limit);

  if (role !== 'doctor') {
    return conversations;
  }

  const doctorProfile = await Doctor.findOne({ userId });

  if (!doctorProfile) {
    throw new AppError('Doctor profile not found', 404);
  }

  return conversations.filter((conversation) =>
    conversation.appointmentId?.doctorId?._id?.equals(doctorProfile._id),
  );
};

const resolveEscalation = async (userData, conversationId, payload = {}) => {
  const { id: userId, role } = userData;
  const { resolutionNote } = payload;

  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new AppError('Invalid conversation id', 400);
  }

  const conversation = await AssistantConversation.findById(
    conversationId,
  ).populate({
    path: 'appointmentId',
    select: 'doctorId',
  });

  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  if (role === 'doctor') {
    const doctorProfile = await Doctor.findOne({ userId });

    if (!doctorProfile) {
      throw new AppError('Doctor profile not found', 404);
    }

    const isOwnerDoctor = conversation.appointmentId?.doctorId?.equals(
      doctorProfile._id,
    );

    if (!isOwnerDoctor) {
      throw new AppError('Unauthorized escalation access', 401);
    }
  }

  if (
    role === 'receptionist' &&
    conversation.escalation?.targetRole !== 'receptionist'
  ) {
    throw new AppError('Unauthorized escalation access', 401);
  }

  conversation.status = 'closed';
  conversation.escalation = {
    ...conversation.escalation,
    isEscalated: false,
    resolvedAt: new Date(),
    resolvedBy: role,
  };
  conversation.messages.push({
    role: 'system',
    content: resolutionNote || `Escalation resolved by ${role}.`,
    intent: 'escalation',
    meta: {
      resolvedBy: role,
    },
    createdAt: new Date(),
  });
  conversation.lastMessageAt = new Date();

  await conversation.save();

  return conversation;
};

module.exports = {
  askAssistant,
  getConversationById,
  escalateConversation,
  getAppointmentContext,
  listPatientConversations,
  getEscalationInbox,
  resolveEscalation,
  getIntakeAutofill,
  getIntakeAutofillFromChat,
  deleteConversation,
};
