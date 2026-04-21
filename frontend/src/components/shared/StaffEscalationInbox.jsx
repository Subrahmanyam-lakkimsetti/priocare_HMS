import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const formatDateTime = (value) => {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getPatientName = (patient) => {
  if (!patient) {
    return 'Unknown patient';
  }

  return [patient.firstName, patient.lastName].filter(Boolean).join(' ');
};

export default function StaffEscalationInbox({ className = '' }) {
  const navigate = useNavigate();
  const role = useSelector((s) => s.auth?.user?.role);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resolvingId, setResolvingId] = useState('');

  const canViewInbox = useMemo(
    () => ['doctor', 'receptionist'].includes(role),
    [role],
  );

  const fetchInbox = async () => {
    if (!canViewInbox) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await api.get('/assistant/staff/escalations', {
        params: { limit: 8 },
      });

      setItems(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load escalations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, [canViewInbox]);

  const resolveEscalation = async (conversationId) => {
    try {
      setResolvingId(conversationId);
      setError('');

      await api.patch(
        `/assistant/staff/escalations/${conversationId}/resolve`,
        {
          resolutionNote: `Escalation reviewed by ${role}.`,
        },
      );

      setItems((prev) => prev.filter((item) => item._id !== conversationId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resolve escalation');
    } finally {
      setResolvingId('');
    }
  };

  const openWorkflow = (item) => {
    const token = item?.appointmentId?.token;

    if (!token) {
      return;
    }

    if (role === 'receptionist') {
      navigate(`/receptionist/search?token=${encodeURIComponent(token)}`);
      return;
    }

    if (role === 'doctor') {
      navigate(`/doctor/consultation?token=${encodeURIComponent(token)}`);
      return;
    }

    navigate(`/receptionist/search?token=${encodeURIComponent(token)}`);
  };

  if (!canViewInbox) {
    return null;
  }

  return (
    <section
      className={`bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden ${className}`}
    >
      <header className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Assistant Escalations
          </h3>
          <p className="text-xs text-slate-500">
            Patient queries flagged for {role} review
          </p>
        </div>
        <button
          type="button"
          onClick={fetchInbox}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
        >
          Refresh
        </button>
      </header>

      <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
        {loading && (
          <p className="text-xs text-slate-500">Loading escalations...</p>
        )}

        {!loading && error && <p className="text-xs text-red-600">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <p className="text-xs text-slate-500">No pending escalations.</p>
        )}

        {!loading &&
          !error &&
          items.map((item) => {
            const patientName = getPatientName(item.patientId);
            const token = item.appointmentId?.token || 'N/A';

            return (
              <article
                key={item._id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {patientName}
                  </p>
                  <span className="text-[11px] text-slate-500">
                    {formatDateTime(item.lastMessageAt)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-1">
                  Token: {token} • Target:{' '}
                  {item.escalation?.targetRole || 'N/A'}
                </p>
                <p className="text-xs text-amber-800 mb-2">
                  {item.escalation?.reason || 'Escalated by assistant'}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={token === 'N/A'}
                    onClick={() => openWorkflow(item)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-700 disabled:opacity-50 hover:bg-slate-100"
                  >
                    Open Workflow
                  </button>

                  <button
                    type="button"
                    disabled={resolvingId === item._id}
                    onClick={() => resolveEscalation(item._id)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-emerald-600 text-white disabled:opacity-60 hover:bg-emerald-700"
                  >
                    {resolvingId === item._id
                      ? 'Resolving...'
                      : 'Mark Resolved'}
                  </button>
                </div>
              </article>
            );
          })}
      </div>
    </section>
  );
}
