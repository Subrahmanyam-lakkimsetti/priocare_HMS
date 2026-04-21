const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['patient', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    intent: {
      type: String,
      default: 'general',
    },
    confidence: {
      type: Number,
      default: null,
    },
    safetyNotice: {
      type: String,
      default: null,
    },
    meta: {
      type: Object,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);

const assistantConversationSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
    status: {
      type: String,
      enum: ['open', 'escalated', 'closed'],
      default: 'open',
    },
    escalation: {
      isEscalated: {
        type: Boolean,
        default: false,
      },
      reason: {
        type: String,
        default: null,
      },
      targetRole: {
        type: String,
        enum: ['doctor', 'receptionist', null],
        default: null,
      },
      escalatedAt: {
        type: Date,
        default: null,
      },
      resolvedAt: {
        type: Date,
        default: null,
      },
      resolvedBy: {
        type: String,
        enum: ['doctor', 'receptionist', 'admin', null],
        default: null,
      },
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

assistantConversationSchema.index({ patientId: 1, lastMessageAt: -1 });
assistantConversationSchema.index({ appointmentId: 1 });

const AssistantConversation = mongoose.model(
  'AssistantConversation',
  assistantConversationSchema,
);

module.exports = AssistantConversation;
