const catchAsync = require('../../../utils/catchAsync.util');
const assistantService = require('./assistant.service');

const askAssistant = catchAsync(async (req, res) => {
  const result = await assistantService.askAssistant(req.data.id, req.body);

  res.status(200).json({
    isSuccess: true,
    message: 'Assistant response generated',
    data: result,
  });
});

const getConversationById = catchAsync(async (req, res) => {
  const conversation = await assistantService.getConversationById(
    req.data.id,
    req.params.conversationId,
  );

  res.status(200).json({
    isSuccess: true,
    message: 'conversation details',
    data: conversation,
  });
});

const listPatientConversations = catchAsync(async (req, res) => {
  const conversations = await assistantService.listPatientConversations(
    req.data.id,
    req.query,
  );

  res.status(200).json({
    isSuccess: true,
    totalDocuments: conversations.length,
    message: 'patient assistant conversations',
    data: conversations,
  });
});

const escalateConversation = catchAsync(async (req, res) => {
  const conversation = await assistantService.escalateConversation(
    req.data.id,
    req.body,
  );

  res.status(200).json({
    isSuccess: true,
    message: 'conversation escalated',
    data: conversation,
  });
});

const getAppointmentContext = catchAsync(async (req, res) => {
  const context = await assistantService.getAppointmentContext(
    req.data.id,
    req.params.appointmentId,
  );

  res.status(200).json({
    isSuccess: true,
    message: 'appointment context for assistant',
    data: context,
  });
});

const getIntakeAutofill = catchAsync(async (req, res) => {
  const suggestions = await assistantService.getIntakeAutofill(
    req.data.id,
    req.body,
  );

  res.status(200).json({
    isSuccess: true,
    message: 'intake autofill suggestions',
    data: suggestions,
  });
});

const getIntakeFromChat = catchAsync(async (req, res) => {
  const suggestions = await assistantService.getIntakeAutofillFromChat(
    req.data.id,
    req.body,
  );

  res.status(200).json({
    isSuccess: true,
    message: 'intake suggestions from chat',
    data: suggestions,
  });
});

const deleteConversation = catchAsync(async (req, res) => {
  await assistantService.deleteConversation(
    req.data.id,
    req.params.conversationId,
  );

  res.status(200).json({
    isSuccess: true,
    message: 'conversation deleted',
  });
});

const getEscalationInbox = catchAsync(async (req, res) => {
  const escalations = await assistantService.getEscalationInbox(
    req.data,
    req.query,
  );

  res.status(200).json({
    isSuccess: true,
    totalDocuments: escalations.length,
    message: 'assistant escalation inbox',
    data: escalations,
  });
});

const resolveEscalation = catchAsync(async (req, res) => {
  const conversation = await assistantService.resolveEscalation(
    req.data,
    req.params.conversationId,
    req.body,
  );

  res.status(200).json({
    isSuccess: true,
    message: 'assistant escalation resolved',
    data: conversation,
  });
});

module.exports = {
  askAssistant,
  listPatientConversations,
  getConversationById,
  escalateConversation,
  getAppointmentContext,
  getIntakeAutofill,
  getIntakeFromChat,
  deleteConversation,
  getEscalationInbox,
  resolveEscalation,
};
