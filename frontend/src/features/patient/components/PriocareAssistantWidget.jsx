import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  askPriocareAssistant,
  escalateAssistantConversation,
  fetchAssistantConversation,
  fetchAssistantConversations,
  fetchAssistantAppointmentContext,
  deleteAssistantConversation,
} from '../patientThunks';
import {
  openAssistant,
  closeAssistant,
  clearAssistantError,
} from '../patientSlice';

const QUICK_PROMPTS = [
  {
    label: 'Appointment status',
    value: 'Please explain my current appointment status in simple words.',
    intent: 'appointment',
  },
  {
    label: 'Find my doctor',
    value: 'Which doctor is assigned to me right now?',
    intent: 'appointment',
  },
  {
    label: 'Explain prescription',
    value: 'Can you explain my current prescription in easy language?',
    intent: 'prescription',
  },
];

export default function PriocareAssistantWidget() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [localNotice, setLocalNotice] = useState(null);
  const [showNudge, setShowNudge] = useState(true);

  const activeAppointment = useSelector((s) => s.patient?.activeAppointment);
  const assistant = useSelector((s) => s.patient?.assistant);

  useEffect(() => {
    if (!localNotice) {
      return;
    }
    const timer = window.setTimeout(() => setLocalNotice(null), 3000);
    return () => window.clearTimeout(timer);
  }, [localNotice]);

  useEffect(() => {
    if (!showNudge) {
      return;
    }
    const timer = window.setTimeout(() => setShowNudge(false), 3500);
    return () => window.clearTimeout(timer);
  }, [showNudge]);

  const canSend = useMemo(
    () => input.trim().length > 1 && !assistant?.sending,
    [input, assistant?.sending],
  );

  const isAppointmentIntent = (message) => {
    const text = String(message || '').toLowerCase();
    return (
      text.includes('appointment') ||
      text.includes('book') ||
      text.includes('consult')
    );
  };

  const onAsk = (question, intent = 'general') => {
    const cleanQuestion = String(question || '').trim();

    if (!cleanQuestion) {
      return;
    }

    if (isAppointmentIntent(cleanQuestion)) {
      setLocalNotice('Please fill your details in the intake form.');
      navigate('/patient/intake');
      setInput('');
      return;
    }

    dispatch(
      askPriocareAssistant({
        question: cleanQuestion,
        conversationId: assistant?.conversationId || undefined,
        appointmentId: activeAppointment?._id || undefined,
        intent,
        pageContext: 'patient-portal',
      }),
    );

    setInput('');
  };

  const onOpen = () => {
    dispatch(openAssistant());
    dispatch(clearAssistantError());
    dispatch(fetchAssistantAppointmentContext(activeAppointment?._id));
    dispatch(fetchAssistantConversations({ limit: 8 })).then((action) => {
      const list = action.payload || [];
      if (!assistant?.conversationId && list[0]?._id) {
        dispatch(fetchAssistantConversation(list[0]._id));
      }
    });
  };

  const onSelectConversation = (conversationId) => {
    dispatch(fetchAssistantConversation(conversationId));
  };

  const onDeleteConversation = () => {
    if (!assistant?.conversationId) {
      return;
    }
    const confirmed = window.confirm('Delete this chat history?');
    if (!confirmed) {
      return;
    }
    dispatch(deleteAssistantConversation(assistant.conversationId)).then(() => {
      dispatch(fetchAssistantConversations({ limit: 8 }));
    });
  };

  return (
    <>
      {!assistant?.isOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
          {showNudge && (
            <div className="bg-white text-[#0f4a5e] text-xs font-semibold px-3 py-1.5 rounded-full shadow-md border border-[#0f4a5e]/15">
              AI Assistant
            </div>
          )}
          <button
            type="button"
            onClick={onOpen}
            className="h-12 w-12 rounded-full bg-[#0f4a5e] text-white shadow-xl hover:bg-[#0b2f3f] transition-colors flex items-center justify-center"
            aria-label="Open AI assistant"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M20 12a8 8 0 11-16 0 8 8 0 0116 0z"
              />
            </svg>
          </button>
        </div>
      )}

      {assistant?.isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[92vw] max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#0f4a5e] text-white">
            <div>
              <p className="font-semibold">Priocare Assistant</p>
              <p className="text-xs text-cyan-100">
                Hospital guidance only. No diagnosis or treatment advice.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!assistant?.conversationId}
                className="rounded-md px-2 py-1 text-xs hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={onDeleteConversation}
              >
                Delete chat
              </button>
              <button
                type="button"
                className="rounded-md px-2 py-1 hover:bg-white/10"
                onClick={() => dispatch(closeAssistant())}
              >
                Close
              </button>
            </div>
          </div>

          <div className="px-4 pt-3 pb-2 border-b border-slate-100 bg-slate-50">
            {assistant?.conversations?.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {assistant.conversations.slice(0, 4).map((conversation) => {
                  const isActive =
                    assistant?.conversationId === conversation._id;
                  return (
                    <button
                      key={conversation._id}
                      type="button"
                      onClick={() => onSelectConversation(conversation._id)}
                      className={`text-[11px] px-2 py-1 rounded-full border ${
                        isActive
                          ? 'bg-[#0f4a5e] text-white border-[#0f4a5e]'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {conversation.status}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt.label}
                  type="button"
                  onClick={() =>
                    onAsk(prompt.value, prompt.intent || 'general')
                  }
                  className="text-xs bg-white border border-slate-200 px-2.5 py-1.5 rounded-full hover:bg-slate-100"
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-white">
            {localNotice && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700 flex items-center justify-between gap-2">
                <span>{localNotice}</span>
                <button
                  type="button"
                  onClick={() => navigate('/patient/intake')}
                  className="text-[11px] font-semibold px-2 py-1 rounded-full border border-blue-200 bg-white text-blue-700 hover:bg-blue-100"
                >
                  Go to intake
                </button>
              </div>
            )}
            {assistant?.messages?.length ? (
              assistant.messages.map((msg, idx) => {
                const isPatient = msg.role === 'patient';

                return (
                  <div
                    key={`${msg.createdAt || ''}-${idx}`}
                    className={`flex ${isPatient ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm ${
                        isPatient
                          ? 'bg-[#0f4a5e] text-white rounded-br-md'
                          : 'bg-slate-100 text-slate-900 rounded-bl-md'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-500">
                Ask anything about appointments, intake guidance, or your
                existing prescription details.
              </p>
            )}

            {assistant?.sending && (
              <p className="text-xs text-slate-500">Assistant is typing...</p>
            )}

            {assistant?.error && (
              <p className="text-xs text-red-600">{assistant.error}</p>
            )}

            {assistant?.requiresEscalation && assistant?.conversationId && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs text-amber-900">
                  Escalation recommended:{' '}
                  {assistant.escalationReason || 'Medical review needed.'}
                </p>
                <button
                  type="button"
                  className="mt-2 text-xs px-2 py-1 rounded bg-amber-600 text-white hover:bg-amber-700"
                  onClick={() =>
                    dispatch(
                      escalateAssistantConversation({
                        conversationId: assistant.conversationId,
                        reason:
                          assistant.escalationReason ||
                          'Patient requested support escalation',
                        targetRole: activeAppointment?._id
                          ? 'doctor'
                          : 'receptionist',
                      }),
                    )
                  }
                >
                  Escalate now
                </button>
              </div>
            )}

            {assistant?.lastSafetyNotice && (
              <p className="text-xs text-slate-500 border-t border-slate-100 pt-2">
                {assistant.lastSafetyNotice}
              </p>
            )}
          </div>

          <div className="p-3 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-200"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Priocare Assistant"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canSend) {
                    onAsk(input);
                  }
                }}
              />
              <button
                type="button"
                className="px-3 py-2 rounded-lg bg-[#0f4a5e] text-white text-sm disabled:opacity-50"
                disabled={!canSend}
                onClick={() => onAsk(input)}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
