import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  fetchAllDoctors,
  fetchAllReceptionists,
  fetchPendingProfiles,
  deletePendingStaff,
  deActivateDoctor,
  activateDoctor,
  deActivateReceptionist,
  activateReceptionist,
} from '../adminThunks';
import CreateDoctorModal from '../components/CreateDoctorModal';
import CreateReceptionistModal from '../components/CreateReceptionistModal';

/* ── Only keyframes Tailwind can't handle natively ── */
const ANIM_CSS = `
  @keyframes smFadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes smSpin    { to{transform:rotate(360deg)} }
  @keyframes smPulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes smFadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes smScaleIn { from{transform:scale(.82);opacity:0} to{transform:scale(1);opacity:1} }
  @keyframes smScaleOut{ from{transform:scale(1);opacity:1} to{transform:scale(.82);opacity:0} }
  @keyframes moreBounce{ 0%,100%{transform:translateY(0)} 40%{transform:translateY(-3px)} 70%{transform:translateY(-1px)} }
  @keyframes moreGlow  { 0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,.22)} 50%{box-shadow:0 0 0 5px rgba(37,99,235,.1)} }

  .sm-fade-up  { animation: smFadeUp .35s ease both; }
  .sm-delay-1  { animation-delay:.05s }
  .sm-delay-2  { animation-delay:.1s  }
  .sm-delay-3  { animation-delay:.15s }
  .sm-spin-a   { animation: smSpin .8s linear infinite; }
  .sm-pulse-a  { animation: smPulse 2s ease infinite; }
  .sm-fadein   { animation: smFadeIn .15s ease both; }
  .sm-scale-in { animation: smScaleIn  .22s cubic-bezier(.34,1.56,.64,1) both; }
  .sm-scale-out{ animation: smScaleOut .17s ease both; }

  .doc-panel       { overflow:hidden; transition: max-height .3s ease, opacity .25s ease; }
  .doc-panel.open  { max-height:240px; opacity:1; }
  .doc-panel.shut  { max-height:0; opacity:0; }

  .chev      { display:inline-block; transition:transform .25s ease; line-height:1; }
  .chev.open { transform:rotate(180deg); }

  .more-pill {
    display:inline-flex; align-items:center; gap:5px;
    font-size:11px; font-weight:700; padding:4px 11px; border-radius:20px;
    cursor:pointer; background:#eff6ff; color:#2563eb; border:1.5px solid #bfdbfe;
    animation: moreBounce 2.4s ease infinite, moreGlow 2.4s ease infinite;
    transition: background .15s, transform .15s;
  }
  .more-pill:hover { background:#dbeafe !important; animation:none; transform:translateY(-1px); }
  .more-pill.open  { background:#f1f5f9 !important; color:#64748b; border-color:#e2e8f0; animation:none; }
  .more-pill.open:hover { background:#e2e8f0 !important; }

  .doc-row       { transition:background .12s; cursor:pointer; }
  .doc-row:hover { background:#f8fafc !important; }

  ::-webkit-scrollbar       { width:4px; }
  ::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:4px; }
`;

/* ── Dept color map ── */
const DEPT_COLORS = {
  Cardiology: {
    bar: '#2563eb',
    light: '#eff6ff',
    border: '#bfdbfe',
    text: '#1d4ed8',
  },
  Neurology: {
    bar: '#7c3aed',
    light: '#f5f3ff',
    border: '#ddd6fe',
    text: '#6d28d9',
  },
  'General Medicine': {
    bar: '#059669',
    light: '#f0fdf4',
    border: '#a7f3d0',
    text: '#047857',
  },
  Orthopedics: {
    bar: '#d97706',
    light: '#fffbeb',
    border: '#fde68a',
    text: '#b45309',
  },
  Gastroenterology: {
    bar: '#0891b2',
    light: '#ecfeff',
    border: '#a5f3fc',
    text: '#0e7490',
  },
  Pediatrics: {
    bar: '#db2777',
    light: '#fdf2f8',
    border: '#fbcfe8',
    text: '#be185d',
  },
  Pulmonology: {
    bar: '#ea580c',
    light: '#fff7ed',
    border: '#fed7aa',
    text: '#c2410c',
  },
  Endocrinology: {
    bar: '#4f46e5',
    light: '#eef2ff',
    border: '#c7d2fe',
    text: '#4338ca',
  },
  'Emergency Medicine': {
    bar: '#dc2626',
    light: '#fff1f2',
    border: '#fecaca',
    text: '#b91c1c',
  },
};
const DC_DEF = {
  bar: '#64748b',
  light: '#f8fafc',
  border: '#e2e8f0',
  text: '#475569',
};
const getDC = (d) => DEPT_COLORS[d] ?? DC_DEF;

function ConfirmPopup({
  open,
  closing,
  icon,
  iconBg,
  iconBorder,
  title,
  message,
  sub,
  confirmLabel,
  confirmBtnClass,
  confirmBtnStyle,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      className="sm-fadein fixed inset-0 z-60 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ background: 'rgba(15,23,42,.45)' }}
    >
      <div
        className={`${closing ? 'sm-scale-out' : 'sm-scale-in'} bg-white rounded-[22px] p-8 w-full max-w-sm text-center shadow-2xl`}
      >
        <div
          className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl border-2"
          style={{ background: iconBg, borderColor: iconBorder }}
        >
          {icon}
        </div>
        <h3 className="text-[17px] font-extrabold text-slate-900 mb-2">
          {title}
        </h3>
        <p className="text-[13px] text-slate-500 mb-1.5 leading-relaxed">
          {message}
        </p>
        {sub ? (
          <p className="text-xs text-slate-400 mb-6">{sub}</p>
        ) : (
          <div className="mb-6" />
        )}
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-[13px] font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            className={`flex-1 py-3 rounded-xl text-[13px] font-bold text-white border-none transition-colors ${confirmBtnClass}`}
            onClick={onConfirm}
            style={confirmBtnStyle}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function StaffManagement() {
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    doctors,
    receptionists,
    pendingDoctors,
    pendingReceptionists,
    staffLoading,
  } = useSelector((s) => s.admin);

  const [tab, setTab] = useState('doctors');
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showReceptionistModal, setShowReceptionistModal] = useState(false);
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [confirmClosing, setConfirmClosing] = useState(false);
  const pendingRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllDoctors());
    dispatch(fetchAllReceptionists());
    dispatch(fetchPendingProfiles('doctor'));
    dispatch(fetchPendingProfiles('receptionist'));
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.scrollToPending) {
      const role = location.state.role;
      setTab(role === 'receptionist' ? 'receptionists' : 'doctors');
      setTimeout(
        () =>
          pendingRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          }),
        300,
      );
    }
  }, [location.state]);

  const closeConfirm = (cb) => {
    setConfirmClosing(true);
    setTimeout(() => {
      setConfirm(null);
      setConfirmClosing(false);
      cb?.();
    }, 180);
  };

  const handleConfirmAction = () => {
    const { type, payload } = confirm;
    closeConfirm(() => {
      if (type === 'delete-doctor')
        dispatch(deletePendingStaff({ id: payload.id, role: 'doctor' }));
      if (type === 'delete-receptionist')
        dispatch(deletePendingStaff({ id: payload.id, role: 'receptionist' }));
      if (type === 'deactivate-doctor') dispatch(deActivateDoctor(payload.id));
      if (type === 'activate-doctor') dispatch(activateDoctor(payload.id));
      if (type === 'deactivate-rec')
        dispatch(deActivateReceptionist(payload.id));
      if (type === 'activate-rec') dispatch(activateReceptionist(payload.id));
    });
  };

  const allDoctors = doctors.flatMap((dept) =>
    dept.doctors.map((d) => ({ ...d })),
  );
  const filteredDoctors = allDoctors.filter((d) =>
    `${d.firstName} ${d.lastName} ${d.department}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const filteredReceptionists = receptionists.filter((r) =>
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(search.toLowerCase()),
  );
  const pendingDoctorsF = (pendingDoctors || []).filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()),
  );
  const pendingReceptionistsF = (pendingReceptionists || []).filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const POPUP_CFG = confirm
    ? {
        'delete-doctor': {
          icon: '🗑️',
          iconBg: '#fff1f2',
          iconBorder: '#fecaca',
          title: 'Remove Doctor?',
          message: `Remove ${confirm.payload?.name}?`,
          sub: 'Account permanently deleted. Re-invite required.',
          confirmLabel: 'Yes, Remove',
          confirmBtnClass: 'hover:bg-red-700',
          confirmBtnStyle: { background: '#dc2626' },
        },
        'delete-receptionist': {
          icon: '🗑️',
          iconBg: '#fff1f2',
          iconBorder: '#fecaca',
          title: 'Remove Receptionist?',
          message: `Remove ${confirm.payload?.name}?`,
          sub: 'Account permanently deleted. Re-invite required.',
          confirmLabel: 'Yes, Remove',
          confirmBtnClass: 'hover:bg-red-700',
          confirmBtnStyle: { background: '#dc2626' },
        },
        'deactivate-doctor': {
          icon: '⛔',
          iconBg: '#fff1f2',
          iconBorder: '#fecaca',
          title: 'Deactivate Doctor?',
          message: `Deactivate Dr. ${confirm.payload?.name}?`,
          sub: "Won't be able to accept new appointments.",
          confirmLabel: 'Deactivate',
          confirmBtnClass: 'hover:bg-red-700',
          confirmBtnStyle: { background: '#dc2626' },
        },
        'activate-doctor': {
          icon: '✅',
          iconBg: '#f0fdf4',
          iconBorder: '#bbf7d0',
          title: 'Activate Doctor?',
          message: `Activate Dr. ${confirm.payload?.name}?`,
          sub: 'They can accept appointments again.',
          confirmLabel: 'Activate',
          confirmBtnClass: 'hover:bg-green-700',
          confirmBtnStyle: { background: '#16a34a' },
        },
        'deactivate-rec': {
          icon: '⛔',
          iconBg: '#fff1f2',
          iconBorder: '#fecaca',
          title: 'Deactivate Receptionist?',
          message: `Deactivate ${confirm.payload?.name}?`,
          sub: 'System access will be suspended.',
          confirmLabel: 'Deactivate',
          confirmBtnClass: 'hover:bg-red-700',
          confirmBtnStyle: { background: '#dc2626' },
        },
        'activate-rec': {
          icon: '✅',
          iconBg: '#f0fdf4',
          iconBorder: '#bbf7d0',
          title: 'Activate Receptionist?',
          message: `Activate ${confirm.payload?.name}?`,
          sub: 'System access will be restored.',
          confirmLabel: 'Activate',
          confirmBtnClass: 'hover:bg-green-700',
          confirmBtnStyle: { background: '#16a34a' },
        },
      }[confirm.type]
    : null;

  return (
    <>
      <style>{ANIM_CSS}</style>
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {/* ── HEADER ── */}
          <div
            className="sm-fade-up sm-delay-1 rounded-2xl px-7 py-6 flex flex-wrap items-center justify-between gap-4 shadow-lg shadow-blue-200/40"
            style={{ background: 'linear-gradient(135deg,#1e40af,#2563eb)' }}
          >
            <div>
              <p className="text-[11px] font-bold text-white/55 uppercase tracking-widest mb-1.5">
                PrioCare HMS
              </p>
              <h1 className="text-[26px] font-extrabold text-white mb-1">
                Staff Management
              </h1>
              <p className="text-[13px] text-white/60">
                Manage doctors and receptionists
              </p>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowReceptionistModal(true)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white border border-white/30 hover:bg-white/25 transition-colors"
                style={{ background: 'rgba(255,255,255,.15)' }}
              >
                <svg
                  width="13"
                  height="13"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Receptionist
              </button>
              <button
                onClick={() => setShowDoctorModal(true)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-extrabold text-blue-600 bg-white border-none shadow-md"
              >
                <svg
                  width="13"
                  height="13"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Doctor
              </button>
            </div>
          </div>

          {/* ── TABS + SEARCH ── */}
          <div className="sm-fade-up sm-delay-2 flex flex-wrap items-center gap-3">
            {/* tab switcher */}
            <div className="flex bg-white rounded-2xl border border-slate-200 p-1 shadow-sm">
              {[
                {
                  key: 'doctors',
                  label: 'Doctors',
                  count: allDoctors.length,
                  pending: pendingDoctors.length,
                },
                {
                  key: 'receptionists',
                  label: 'Receptionists',
                  count: receptionists.length,
                  pending: pendingReceptionists.length,
                },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => {
                    setTab(t.key);
                    setSearch('');
                  }}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-bold transition-all ${
                    tab === t.key
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                  <span
                    className={`text-[11px] font-bold px-1.5 py-px rounded-lg ${tab === t.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {t.count}
                  </span>
                  {t.pending > 0 && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-px rounded-lg ${tab === t.key ? 'bg-amber-400 text-amber-900' : 'bg-amber-100 text-amber-700'}`}
                    >
                      {t.pending} pending
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* search */}
            <div className="relative flex-1 min-w-55">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#0f172a"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name, email or department…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-[13px] rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm focus:outline-none focus:border-blue-300"
              />
            </div>
          </div>

          {/* ── CONTENT ── */}
          {staffLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="sm-spin-a w-9 h-9 rounded-full border-[3px] border-blue-100 border-t-blue-600" />
            </div>
          ) : tab === 'doctors' ? (
            <div className="sm-fade-up sm-delay-3 flex flex-col gap-5">
              {pendingDoctorsF.length > 0 && (
                <div ref={pendingRef}>
                  <PendingSection
                    staff={pendingDoctorsF}
                    role="doctor"
                    highlight={
                      !!location.state?.scrollToPending &&
                      location.state?.role === 'doctor'
                    }
                    onDelete={(u) =>
                      setConfirm({
                        type: 'delete-doctor',
                        payload: { id: u._id, name: u.email },
                      })
                    }
                  />
                </div>
              )}
              <DoctorsByDept
                doctors={doctors}
                filteredDoctors={filteredDoctors}
                search={search}
                onDeactivate={(d) =>
                  setConfirm({
                    type: 'deactivate-doctor',
                    payload: {
                      id: d._id,
                      name: `${d.firstName} ${d.lastName}`,
                    },
                  })
                }
                onActivate={(d) =>
                  setConfirm({
                    type: 'activate-doctor',
                    payload: {
                      id: d._id,
                      name: `${d.firstName} ${d.lastName}`,
                    },
                  })
                }
              />
            </div>
          ) : (
            <div className="sm-fade-up sm-delay-3 flex flex-col gap-5">
              {pendingReceptionistsF.length > 0 && (
                <div ref={pendingRef}>
                  <PendingSection
                    staff={pendingReceptionistsF}
                    role="receptionist"
                    highlight={
                      !!location.state?.scrollToPending &&
                      location.state?.role === 'receptionist'
                    }
                    onDelete={(u) =>
                      setConfirm({
                        type: 'delete-receptionist',
                        payload: { id: u._id, name: u.email },
                      })
                    }
                  />
                </div>
              )}
              <ReceptionistsTable
                receptionists={filteredReceptionists}
                onDeactivate={(r) =>
                  setConfirm({
                    type: 'deactivate-rec',
                    payload: {
                      id: r._id,
                      name: `${r.firstName} ${r.lastName}`,
                    },
                  })
                }
                onActivate={(r) =>
                  setConfirm({
                    type: 'activate-rec',
                    payload: {
                      id: r._id,
                      name: `${r.firstName} ${r.lastName}`,
                    },
                  })
                }
              />
            </div>
          )}
        </div>
      </div>

      {confirm && POPUP_CFG && (
        <ConfirmPopup
          open={!!confirm}
          closing={confirmClosing}
          {...POPUP_CFG}
          onConfirm={handleConfirmAction}
          onCancel={() => closeConfirm()}
        />
      )}
      {showDoctorModal && (
        <CreateDoctorModal
          onClose={() => {
            setShowDoctorModal(false);
            dispatch(fetchAllDoctors());
            dispatch(fetchPendingProfiles('doctor'));
          }}
        />
      )}
      {showReceptionistModal && (
        <CreateReceptionistModal
          onClose={() => {
            setShowReceptionistModal(false);
            dispatch(fetchAllReceptionists());
            dispatch(fetchPendingProfiles('receptionist'));
          }}
        />
      )}
    </>
  );
}

/* ══════════════════════════════════════════
   PENDING SECTION
══════════════════════════════════════════ */
function PendingSection({ staff, role, highlight, onDelete }) {
  const [glowing, setGlowing] = useState(false);
  useEffect(() => {
    if (highlight) {
      setGlowing(true);
      const t = setTimeout(() => setGlowing(false), 2500);
      return () => clearTimeout(t);
    }
  }, [highlight]);

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden transition-all duration-500 ${glowing ? 'border-2 border-amber-400 shadow-lg shadow-amber-100' : 'border-2 border-amber-200 shadow-sm'}`}
    >
      {/* header */}
      <div className="bg-amber-50 border-b border-amber-100 px-5 py-3 flex flex-wrap items-center gap-2.5">
        <span className="w-0.5 h-4 bg-amber-400 rounded inline-block shrink-0" />
        <span className="text-[13px] font-extrabold text-amber-900">
          Awaiting Profile Setup
        </span>
        <span className="text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 rounded-full px-2.5 py-px">
          {staff.length} {role}
          {staff.length > 1 ? 's' : ''}
        </span>
        {glowing ? (
          <span className="ml-auto text-[11px] font-bold text-amber-600 flex items-center gap-1.5">
            <span className="sm-pulse-a w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            Just added
          </span>
        ) : (
          <span className="ml-auto text-[11px] text-amber-700">
            Invite sent · Profile not yet completed
          </span>
        )}
      </div>

      {/* rows */}
      {staff.map((u, i) => (
        <div
          key={u._id}
          className={`px-5 py-3 flex items-center justify-between gap-3 ${i < staff.length - 1 ? 'border-b border-amber-50' : ''}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
              <svg
                width="15"
                height="15"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#d97706"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-900 mb-0.5">
                {u.email}
              </p>
              <p className="text-[11px] text-slate-400">
                Added{' '}
                {new Date(u.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-px rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Pending Setup
            </span>
            <span
              className={`text-[11px] font-bold px-2.5 py-px rounded-full border ${u.isActive !== false ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}
            >
              {u.isActive !== false ? 'Active' : 'Inactive'}
            </span>
            <button
              onClick={() => onDelete(u)}
              className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
            >
              <svg
                width="12"
                height="12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   DOCTORS BY DEPT
══════════════════════════════════════════ */
function DoctorsByDept({
  doctors,
  filteredDoctors,
  search,
  onDeactivate,
  onActivate,
}) {
  if (search) {
    if (filteredDoctors.length === 0)
      return <EmptyBox>No doctors found</EmptyBox>;
    return (
      <DoctorTable
        doctors={filteredDoctors}
        onDeactivate={onDeactivate}
        onActivate={onActivate}
      />
    );
  }
  if (doctors.length === 0)
    return <EmptyBox>No doctors with completed profiles yet</EmptyBox>;

  return (
    <div className="flex flex-col gap-5">
      {doctors.map((dept) => {
        const dc = getDC(dept._id);
        return (
          <div
            key={dept._id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
          >
            {/* dept header */}
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
              <span
                className="w-1 h-4.5 rounded inline-block shrink-0"
                style={{ background: dc.bar, width: 4, height: 18 }}
              />
              <span className="text-sm font-extrabold text-slate-900">
                {dept._id}
              </span>
              <span
                className="text-[11px] font-bold px-2.5 py-px rounded-full border"
                style={{
                  background: dc.light,
                  color: dc.text,
                  borderColor: dc.border,
                }}
              >
                {dept.doctors.length}{' '}
                {dept.doctors.length === 1 ? 'doctor' : 'doctors'}
              </span>
              <div className="ml-auto flex gap-3">
                {[
                  {
                    v: dept.doctors.reduce(
                      (a, d) => a + d.totalAppointments,
                      0,
                    ),
                    label: 'appts',
                    color: 'text-slate-600',
                  },
                  {
                    v: dept.doctors.reduce(
                      (a, d) => a + d.totalAppointmentsConfirmed,
                      0,
                    ),
                    label: 'confirmed',
                    color: 'text-emerald-600',
                  },
                  {
                    v: dept.doctors.reduce(
                      (a, d) => a + d.totalCancelledAppointments,
                      0,
                    ),
                    label: 'cancelled',
                    color: 'text-red-600',
                  },
                ].map(({ v, label, color }) => (
                  <span key={label} className="text-[11px] text-slate-400">
                    <span className={`font-extrabold text-[13px] ${color}`}>
                      {v}
                    </span>{' '}
                    {label}
                  </span>
                ))}
              </div>
            </div>
            {/* col headers */}
            <div
              className="grid px-5 py-2 border-b border-slate-100 bg-slate-50"
              style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px' }}
            >
              {[
                'Doctor',
                'Experience',
                'Fee',
                'Appointments',
                'Status',
                '',
              ].map((h) => (
                <span
                  key={h}
                  className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.07em]"
                >
                  {h}
                </span>
              ))}
            </div>
            {dept.doctors.map((d, i) => (
              <DoctorRow
                key={d._id}
                doctor={d}
                dc={dc}
                isLast={i === dept.doctors.length - 1}
                onDeactivate={onDeactivate}
                onActivate={onActivate}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function DoctorTable({ doctors, onDeactivate, onActivate }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div
        className="grid px-5 py-2.5 border-b border-slate-100 bg-slate-50"
        style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px' }}
      >
        {['Doctor', 'Experience', 'Fee', 'Appointments', 'Status', ''].map(
          (h) => (
            <span
              key={h}
              className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.07em]"
            >
              {h}
            </span>
          ),
        )}
      </div>
      {doctors.map((d, i) => {
        const dc = getDC(d.department);
        return (
          <DoctorRow
            key={d._id}
            doctor={d}
            dc={dc}
            isLast={i === doctors.length - 1}
            onDeactivate={onDeactivate}
            onActivate={onActivate}
          />
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════
   DOCTOR ROW
══════════════════════════════════════════ */
function DoctorRow({ doctor: d, dc, isLast, onDeactivate, onActivate }) {
  const [open, setOpen] = useState(false);
  const isActive = d.isActive !== false;
  const initials =
    `${d.firstName?.[0] ?? ''}${d.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <div className={isLast ? '' : 'border-b-2 border-slate-100'}>
      {/* summary row */}
      <div
        className="doc-row grid items-center gap-0 px-5 py-3"
        style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px' }}
        onClick={() => setOpen((o) => !o)}
      >
        {/* name */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-[11px] font-extrabold border"
            style={{
              background: `${dc.bar}18`,
              borderColor: dc.border,
              color: dc.text,
            }}
          >
            {initials}
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-900 leading-tight mb-0.5">
              Dr. {d.firstName} {d.lastName}
            </p>
            <span
              className="text-[10px] font-semibold px-1.5 py-px rounded border"
              style={{
                background: dc.light,
                color: dc.text,
                borderColor: dc.border,
              }}
            >
              {d.department}
            </span>
          </div>
        </div>

        {/* experience */}
        <span className="text-[13px] font-bold text-slate-900">
          {d.experienceYears}{' '}
          <span className="text-[11px] font-normal text-slate-400">yrs</span>
        </span>

        {/* fee */}
        <span className="text-[13px] font-bold text-slate-900">
          ₹{d.consultationFee}
        </span>

        {/* appointments */}
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-extrabold text-slate-900">
            {d.totalAppointments}
          </span>
          {d.totalCancelledAppointments > 0 && (
            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 rounded px-1.5 py-px">
              {d.totalCancelledAppointments} ✗
            </span>
          )}
        </div>

        {/* status */}
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border w-fit ${isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-400'}`}
          />
          {isActive ? 'Active' : 'Inactive'}
        </span>

        {/* more pill */}
        <div className="flex justify-end">
          <button
            className={`more-pill${open ? ' open' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => !o);
            }}
          >
            {open ? 'Less' : 'Details'}
            <span
              className={`chev${open ? ' open' : ''}`}
              style={{ fontSize: 10 }}
            >
              ▾
            </span>
          </button>
        </div>
      </div>

      {/* expand panel */}
      <div className={`doc-panel ${open ? 'open' : 'shut'}`}>
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100">
          <div className="grid grid-cols-3 gap-4">
            {/* col 1: specializations + availability */}
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.08em] mb-2">
                Specializations
              </p>
              <div className="flex flex-wrap gap-1 mb-2.5">
                {d.specializations?.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${d.availabilityStatus === 'available' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                >
                  {d.availabilityStatus === 'available'
                    ? '🟢 Available'
                    : '🔴 Unavailable'}
                </span>
                {d.MaxDailyAppointments && (
                  <span className="text-[11px] text-slate-400">
                    Max {d.MaxDailyAppointments}/day
                  </span>
                )}
              </div>
            </div>

            {/* col 2: schedule */}
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.08em] mb-2">
                Schedule
              </p>
              <span className="font-mono text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1 inline-block mb-2">
                🕐 {d.workingHours?.start} – {d.workingHours?.end}
              </span>
              <div className="flex flex-wrap gap-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                  (day) => {
                    const on = d.availableDays?.includes(day);
                    return (
                      <span
                        key={day}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded border"
                        style={{
                          background: on ? dc.light : '#f1f5f9',
                          color: on ? dc.text : '#cbd5e1',
                          borderColor: on ? dc.border : '#e2e8f0',
                        }}
                      >
                        {day}
                      </span>
                    );
                  },
                )}
              </div>
            </div>

            {/* col 3: today stats + action */}
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.08em] mb-2">
                Today's Stats
              </p>
              <div className="flex gap-2 mb-3.5">
                {[
                  {
                    label: 'Total',
                    v: d.todayTotalAppointments,
                    cls: 'bg-slate-50 border-slate-200 text-slate-600',
                  },
                  {
                    label: 'Confirmed',
                    v: d.todayConfirmed,
                    cls: 'bg-green-50 border-green-200 text-green-700',
                  },
                  {
                    label: 'Completed',
                    v: d.todayCompleted,
                    cls: 'bg-blue-50 border-blue-200 text-blue-700',
                  },
                ].map(({ label, v, cls }) => (
                  <div
                    key={label}
                    className={`flex-1 text-center border rounded-lg py-1.5 ${cls}`}
                  >
                    <p className="text-[15px] font-extrabold leading-none mb-0.5">
                      {v}
                    </p>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.05em]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isActive ? onDeactivate(d) : onActivate(d);
                }}
                className={`w-full py-2 rounded-xl text-xs font-bold border transition-colors ${isActive ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'}`}
              >
                {isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   RECEPTIONISTS TABLE
══════════════════════════════════════════ */
function ReceptionistsTable({ receptionists, onDeactivate, onActivate }) {
  if (receptionists.length === 0)
    return <EmptyBox>No receptionists with completed profiles yet</EmptyBox>;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* heading */}
      <div className="bg-slate-50 border-b border-slate-100 px-5 py-3.5 flex items-center gap-2">
        <span
          className="w-1 h-4.5 bg-violet-600 rounded inline-block shrink-0"
          style={{ width: 4, height: 18 }}
        />
        <span className="text-sm font-extrabold text-slate-900">
          Receptionists
        </span>
        <span className="text-[11px] font-bold px-2.5 py-px rounded-full bg-violet-50 text-violet-700 border border-violet-200">
          {receptionists.length} total
        </span>
      </div>
      {/* col headers */}
      <div
        className="grid px-5 py-2 border-b border-slate-100 bg-slate-50"
        style={{ gridTemplateColumns: '2fr 1fr 1fr 120px' }}
      >
        {['Name', 'Phone', 'Status', 'Action'].map((h) => (
          <span
            key={h}
            className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.07em]"
          >
            {h}
          </span>
        ))}
      </div>
      {receptionists.map((r, i) => {
        const active = r.isActive !== false;
        const initials =
          `${r.firstName?.[0] ?? ''}${r.lastName?.[0] ?? ''}`.toUpperCase();
        return (
          <div
            key={r._id}
            className={`doc-row grid items-center px-5 py-3 ${i < receptionists.length - 1 ? 'border-b-2 border-slate-100' : ''}`}
            style={{ gridTemplateColumns: '2fr 1fr 1fr 120px' }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-extrabold text-violet-700 border border-violet-200"
                style={{
                  background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)',
                }}
              >
                {initials}
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-900 mb-0.5">
                  {r.firstName} {r.lastName}
                </p>
                <p className="text-[11px] text-slate-400">Receptionist</p>
              </div>
            </div>
            <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 w-fit">
              {r.phoneNumber || '—'}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border w-fit ${active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-red-400'}`}
              />
              {active ? 'Active' : 'Inactive'}
            </span>
            <button
              onClick={() => (active ? onDeactivate(r) : onActivate(r))}
              className={`text-[11px] font-bold px-3.5 py-1.5 rounded-lg border transition-colors ${active ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'}`}
            >
              {active ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function EmptyBox({ children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center text-slate-300 text-sm">
      {children}
    </div>
  );
}