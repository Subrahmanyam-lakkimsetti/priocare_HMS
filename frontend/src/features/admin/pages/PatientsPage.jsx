import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllPatients,
  deActivatePatient,
  activatePatient,
} from '../adminThunks';
import TokenModal from '../components/TokenModal';

const ITEMS_PER_PAGE = 8;

/* ── Only keyframe animations that Tailwind can't do natively ── */
const ANIM_CSS = `
  @keyframes ppFadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ppFadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes ppScaleIn { from{transform:scale(.82);opacity:0} to{transform:scale(1);opacity:1} }
  @keyframes ppScaleOut{ from{transform:scale(1);opacity:1} to{transform:scale(.82);opacity:0} }
  @keyframes ppSpin    { to{transform:rotate(360deg)} }

  .pp-fade-up   { animation: ppFadeUp .32s ease both; }
  .pp-delay-1   { animation-delay:.04s }
  .pp-delay-2   { animation-delay:.08s }
  .pp-delay-3   { animation-delay:.13s }
  .pp-spin-anim { animation: ppSpin .8s linear infinite; }
  .pp-fadein    { animation: ppFadeIn .15s ease both; }
  .pp-scale-in  { animation: ppScaleIn .22s cubic-bezier(.34,1.56,.64,1) both; }
  .pp-scale-out { animation: ppScaleOut .17s ease both; }

  .pp-panel      { overflow:hidden; transition: max-height .28s ease, opacity .22s ease; }
  .pp-panel.open { max-height:600px; opacity:1; }
  .pp-panel.shut { max-height:0; opacity:0; }

  .pp-chev      { display:inline-block; transition:transform .22s ease; }
  .pp-chev.open { transform:rotate(180deg); }
`;

/* ── Appointment status config ── */
const APPT_STATUS = {
  completed: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-400',
    label: 'Completed',
  },
  cancelled: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    dot: 'bg-red-400',
    label: 'Cancelled',
  },
  checked_in: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
    label: 'Checked In',
  },
  in_consultation: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-400',
    label: 'In Consultation',
  },
  confirmed: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-400',
    label: 'Confirmed',
  },
  pending: {
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    label: 'Pending',
  },
};
const getApptStatus = (s) => APPT_STATUS[s] ?? APPT_STATUS.pending;

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function ApptStatusPill({ status }) {
  const c = getApptStatus(status);
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border w-fit whitespace-nowrap ${c.bg} ${c.text} ${c.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} shrink-0`} />
      {c.label}
    </span>
  );
}

/* ══════════════════════════════════════════
   CONFIRM POPUP
══════════════════════════════════════════ */
function ConfirmPopup({
  open,
  closing,
  isActivating,
  name,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      className="pp-fadein fixed inset-0 z-60 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ background: 'rgba(15,23,42,.45)' }}
    >
      <div
        className={`${closing ? 'pp-scale-out' : 'pp-scale-in'} bg-white rounded-[22px] p-8 w-full max-w-sm text-center shadow-2xl`}
      >
        <div
          className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl border-2 ${isActivating ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
        >
          {isActivating ? '✅' : '⛔'}
        </div>
        <h3 className="text-[17px] font-extrabold text-slate-900 mb-2">
          {isActivating ? 'Activate Patient?' : 'Deactivate Patient?'}
        </h3>
        <p className="text-[13px] text-slate-500 mb-1 leading-relaxed">
          {isActivating ? 'Activate' : 'Deactivate'}{' '}
          <strong className="text-slate-800">{name}</strong>?
        </p>
        <p className="text-xs text-slate-400 mb-6">
          {isActivating
            ? 'Patient will regain access to their account.'
            : 'Patient access will be suspended.'}
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-[13px] font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl text-[13px] font-bold text-white border-none transition-colors ${isActivating ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isActivating ? 'Activate' : 'Deactivate'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function PatientsPage() {
  const dispatch = useDispatch();
  const { patients, patientsLoading } = useSelector((s) => s.admin);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedToken, setSelectedToken] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirmClosing, setConfirmClosing] = useState(false);

  useEffect(() => {
    dispatch(fetchAllPatients());
  }, [dispatch]);

  const filtered = (patients || []).filter((p) => {
    const matchSearch =
      `${p.firstName} ${p.lastName} ${p.phoneNumber} ${p.bloodGroup}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'active' && p.isActive !== false) ||
      (filter === 'inactive' && p.isActive === false);
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleSearch = (v) => {
    setSearch(v);
    setPage(1);
  };
  const handleFilter = (v) => {
    setFilter(v);
    setPage(1);
  };
  const handleToggle = (p) => setConfirmTarget(p);

  const closeConfirm = (cb) => {
    setConfirmClosing(true);
    setTimeout(() => {
      setConfirmTarget(null);
      setConfirmClosing(false);
      cb?.();
    }, 180);
  };

  const handleConfirm = () => {
    const p = confirmTarget;
    closeConfirm(() => {
      if (p.isActive !== false) dispatch(deActivatePatient(p._id));
      else dispatch(activatePatient(p._id));
    });
  };

  const totalActive = (patients || []).filter(
    (p) => p.isActive !== false,
  ).length;
  const totalInactive = (patients || []).filter(
    (p) => p.isActive === false,
  ).length;
  const totalAppts = (patients || []).reduce(
    (a, p) => a + p.totalAppointments,
    0,
  );

  return (
    <>
      <style>{ANIM_CSS}</style>
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {/* ── HEADER ── */}
          <div
            className="pp-fade-up pp-delay-1 rounded-2xl p-6 md:p-7 flex flex-wrap items-center justify-between gap-4 shadow-lg shadow-blue-200/40"
            style={{ background: 'linear-gradient(135deg,#1e40af,#2563eb)' }}
          >
            <div>
              <p className="text-[11px] font-bold text-white/55 uppercase tracking-widest mb-1.5">
                PrioCare HMS
              </p>
              <h1 className="text-2xl md:text-[26px] font-extrabold text-white mb-1">
                Patient Records
              </h1>
              <p className="text-[13px] text-white/60">
                Manage and monitor all registered patients
              </p>
            </div>
            <div className="flex items-center gap-4">
              {[
                {
                  label: 'Total',
                  value: (patients || []).length,
                  color: 'text-white',
                },
                {
                  label: 'Active',
                  value: totalActive,
                  color: 'text-green-300',
                },
                {
                  label: 'Inactive',
                  value: totalInactive,
                  color: 'text-red-300',
                },
                { label: 'Appts', value: totalAppts, color: 'text-blue-200' },
              ].map(({ label, value, color }, i, arr) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="text-center">
                    <p
                      className={`text-[22px] font-extrabold ${color} leading-none mb-0.5`}
                    >
                      {value}
                    </p>
                    <p className="text-[10px] text-white/55 font-semibold uppercase tracking-[0.08em]">
                      {label}
                    </p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-px h-8 bg-white/20" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── FILTERS ── */}
          <div className="pp-fade-up pp-delay-2 flex flex-wrap items-center gap-2.5">
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
                placeholder="Search by name, phone, blood group…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-[13px] rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm focus:outline-none focus:border-blue-300"
              />
            </div>

            {/* filter toggle */}
            <div className="flex bg-white rounded-2xl border border-slate-200 p-1 shadow-sm">
              {['all', 'active', 'inactive'].map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilter(f)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    filter === f
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
              {filtered.length} patient{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* ── TABLE ── */}
          <div className="pp-fade-up pp-delay-3 bg-white border border-slate-200 rounded-[18px] overflow-hidden shadow-sm">
            {patientsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="pp-spin-anim w-9 h-9 rounded-full border-[3px] border-blue-100 border-t-blue-600" />
              </div>
            ) : paginated.length === 0 ? (
              <div className="py-16 text-center text-slate-300 text-sm">
                No patients found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-215">
                  {/* column headers */}
                  <div
                    className="grid gap-0 px-5 py-2.5 border-b border-slate-100 bg-slate-50"
                    style={{
                      gridTemplateColumns:
                        '2fr 0.7fr 1.1fr 0.6fr 0.6fr 0.6fr 0.6fr 0.8fr 140px',
                    }}
                  >
                    {[
                      'Patient',
                      'Blood',
                      'Phone',
                      'Total',
                      'Done',
                      'Cancelled',
                      'Progress',
                      'Status',
                      'Actions',
                    ].map((h) => (
                      <span
                        key={h}
                        className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.07em]"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {paginated.map((p, i) => (
                    <PatientRow
                      key={p._id}
                      patient={p}
                      isLast={i === paginated.length - 1}
                      onToggle={() => handleToggle(p)}
                      onTokenClick={(tok) => setSelectedToken(tok)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex-wrap gap-2.5">
                <p className="text-xs text-slate-400 font-medium">
                  Page <strong className="text-slate-600">{page}</strong> of{' '}
                  <strong className="text-slate-600">{totalPages}</strong> ·{' '}
                  {filtered.length} patients
                </p>
                <div className="flex gap-1">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        page === i + 1
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-200 border-none'
                          : 'border border-slate-200 text-slate-600 hover:bg-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmPopup
        open={!!confirmTarget}
        closing={confirmClosing}
        isActivating={confirmTarget?.isActive === false}
        name={
          confirmTarget
            ? `${confirmTarget.firstName} ${confirmTarget.lastName}`
            : ''
        }
        onConfirm={handleConfirm}
        onCancel={() => closeConfirm()}
      />

      {selectedToken && (
        <TokenModal
          token={selectedToken}
          onClose={() => setSelectedToken(null)}
        />
      )}
    </>
  );
}

/* ══════════════════════════════════════════
   PATIENT ROW
══════════════════════════════════════════ */
function PatientRow({ patient: p, isLast, onToggle, onTokenClick }) {
  const [open, setOpen] = useState(false);
  const isActive = p.isActive !== false;
  const initials =
    `${p.firstName?.[0] ?? ''}${p.lastName?.[0] ?? ''}`.toUpperCase();
  const hasPhoto = !!p.photo;
  const hasAppts = (p.appointments || []).length > 0;

  return (
    <div className={isLast ? '' : 'border-b-2 border-slate-100'}>
      {/* ── SUMMARY ROW ── */}
      <div
        className="grid gap-0 px-5 py-3 items-center hover:bg-slate-50 transition-colors cursor-pointer"
        style={{
          gridTemplateColumns:
            '2fr 0.7fr 1.1fr 0.6fr 0.6fr 0.6fr 0.6fr 0.8fr 140px',
          minWidth: 860,
        }}
        onClick={() => setOpen((o) => !o)}
      >
        {/* patient */}
        <div className="flex items-center gap-2.5">
          {hasPhoto ? (
            <img
              src={p.photo}
              alt=""
              className="w-8 h-8 rounded-xl object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-extrabold text-blue-600 border border-blue-200"
              style={{ background: 'linear-gradient(135deg,#dbeafe,#ede9fe)' }}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slate-900 leading-tight mb-0.5 whitespace-nowrap">
              {p.firstName} {p.lastName}
            </p>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400 font-medium">
                {p.age} yrs · {p.gender}
              </span>
              {p.insuranceDetails && (
                <span className="text-[9px] font-bold px-1.5 py-px rounded bg-blue-50 text-blue-600 border border-blue-200">
                  🛡
                </span>
              )}
            </div>
          </div>
        </div>

        {/* blood */}
        <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 w-fit">
          {p.bloodGroup || '—'}
        </span>

        {/* phone */}
        <span className="font-mono text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5 w-fit">
          {p.phoneNumber}
        </span>

        {/* total */}
        <span className="text-sm font-extrabold text-slate-900 text-center">
          {p.totalAppointments}
        </span>

        {/* completed */}
        <span className="text-sm font-extrabold text-green-600 text-center">
          {p.totalCompletedAppointments}
        </span>

        {/* cancelled */}
        <span className="text-sm font-extrabold text-red-600 text-center">
          {p.cancelledAppointments}
        </span>

        {/* in progress */}
        <span className="text-sm font-extrabold text-amber-500 text-center">
          {p.inprogress}
        </span>

        {/* active status */}
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border w-fit ${
            isActive
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-600 border-red-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-400'}`}
          />
          {isActive ? 'Active' : 'Inactive'}
        </span>

        {/* actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              isActive
                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
            }`}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => !o);
            }}
            title={open ? 'Collapse' : 'View details'}
            className={`flex items-center justify-center w-7 h-7 rounded-lg border text-sm font-bold transition-all shrink-0 ${
              open
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
            }`}
          >
            <span className={`pp-chev${open ? ' open' : ''}`}>▾</span>
          </button>
        </div>
      </div>

      {/* ── EXPAND PANEL ── */}
      <div className={`pp-panel ${open ? 'open' : 'shut'}`}>
        <div className="border-t-2 border-blue-100 border-l-[3px] border-l-blue-600 bg-slate-50">
          {/* info strip */}
          <div className="flex border-b border-slate-100">
            <div className="flex-1 px-5 py-3 border-r border-slate-100">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.08em] mb-1">
                Address
              </p>
              <p className="text-xs text-slate-600 font-medium">
                {p.address || '—'}
              </p>
            </div>
            {p.insuranceDetails && (
              <div className="flex-[1.5] px-5 py-3 border-r border-slate-100">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.08em] mb-1">
                  Insurance
                </p>
                <p className="text-xs text-blue-600 font-semibold">
                  {p.insuranceDetails}
                </p>
              </div>
            )}
            <div className="px-5 py-3">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.08em] mb-1">
                Member Since
              </p>
              <p className="text-xs text-slate-600 font-medium">
                {formatDate(p.createdAt)}
              </p>
            </div>
          </div>

          {/* appointment history */}
          {!hasAppts ? (
            <div className="py-5 text-center text-slate-300 text-sm">
              No appointments yet
            </div>
          ) : (
            <>
              {/* section header */}
              <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-100">
                <span className="w-0.5 h-3.5 bg-blue-600 rounded inline-block" />
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.08em]">
                  Appointment History
                </span>
                <span className="text-[10px] font-bold px-2 py-px rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                  {p.appointments.length}
                </span>
              </div>

              {/* 2 per row grid */}
              <div className="grid grid-cols-2">
                {(p.appointments || []).map((appt, i) => {
                  const sc = getApptStatus(appt.status);
                  const isRightCol = i % 2 === 1;
                  const isLastRow =
                    i >=
                    p.appointments.length -
                      (p.appointments.length % 2 === 0 ? 2 : 1);
                  return (
                    <div
                      key={appt._id || i}
                      onClick={(e) => e.stopPropagation()}
                      className={`flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-slate-100 transition-colors cursor-pointer
                        ${isLastRow ? '' : 'border-b border-slate-100'}
                        ${isRightCol ? 'border-l border-slate-100' : ''}
                        ${i % 4 < 2 ? 'bg-white' : 'bg-slate-50/60'}
                      `}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTokenClick(appt.token);
                        }}
                        className="font-mono text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1 hover:bg-blue-100 hover:text-blue-800 transition-colors shrink-0 tracking-wide"
                      >
                        #{appt.token}
                      </button>
                      <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                        {formatDate(appt.scheduledDate)}
                      </span>
                      <ApptStatusPill status={appt.status} />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}