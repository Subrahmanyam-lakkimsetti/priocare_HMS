const express = require('express');
const {
  authMiddleware,
  restrictTo,
} = require('../../../middlewares/auth.middleware');
const { validateInput } = require('../../../middlewares/validation.middleware');
const {
  askAssistantValidationSchema,
  escalateAssistantValidationSchema,
  resolveEscalationValidationSchema,
  intakeAutofillValidationSchema,
  intakeFromChatValidationSchema,
} = require('./assistant.validation');
const {
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
} = require('./assistant.controller');

const assistantRouter = express.Router();
const patientAssistantRouter = express.Router();
const staffAssistantRouter = express.Router();

assistantRouter.use(authMiddleware);
patientAssistantRouter.use(restrictTo('patient'));
staffAssistantRouter.use(restrictTo('doctor', 'receptionist', 'admin'));

patientAssistantRouter.post(
  '/ask',
  validateInput(askAssistantValidationSchema),
  askAssistant,
);
patientAssistantRouter.post(
  '/escalate',
  validateInput(escalateAssistantValidationSchema),
  escalateConversation,
);
patientAssistantRouter.post(
  '/intake-autofill',
  validateInput(intakeAutofillValidationSchema),
  getIntakeAutofill,
);
patientAssistantRouter.post(
  '/intake-from-chat',
  validateInput(intakeFromChatValidationSchema),
  getIntakeFromChat,
);
patientAssistantRouter.get('/conversations', listPatientConversations);
patientAssistantRouter.get(
  '/conversations/:conversationId',
  getConversationById,
);
patientAssistantRouter.delete(
  '/conversations/:conversationId',
  deleteConversation,
);
patientAssistantRouter.get('/appointment-context', getAppointmentContext);
patientAssistantRouter.get(
  '/appointment-context/:appointmentId',
  getAppointmentContext,
);

staffAssistantRouter.get('/staff/escalations', getEscalationInbox);
staffAssistantRouter.patch(
  '/staff/escalations/:conversationId/resolve',
  validateInput(resolveEscalationValidationSchema),
  resolveEscalation,
);

assistantRouter.use(patientAssistantRouter);
assistantRouter.use(staffAssistantRouter);

module.exports = {
  assistantRouter,
};
