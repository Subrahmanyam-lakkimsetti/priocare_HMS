import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointmentsByDepartment } from '../adminThunks';
import TokenModal from '../components/TokenModal';

const STATUS_BADGE = {
  completed: 'bg-green-50 text-green-700 border border-green-200',
  cancelled: 'bg-red-50 text-red-600 border border-red-200',
  checked_in: 'bg-amber-50 text-amber-700 border border-amber-200',
  in_consultation: 'bg-blue-50 text-blue-700 border border-blue-200',
  pending: 'bg-slate-100 text-slate-600 border border-slate-200',
};

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const ITEMS_PER_PAGE = 10;

export default function AppointmentsPage() {
  const dispatch = useDispatch();
  const { appointmentsByDept, appointmentsLoading } = useSelector(
    (s) => s.admin,
  );
  const [activeDept, setActiveDept] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAppointmentsByDepartment());
  }, [dispatch]);

  useEffect(() => {
    if (appointmentsByDept.length > 0 && !activeDept) {
      setActiveDept(appointmentsByDept[0]._id);
    }
  }, [appointmentsByDept]);

  const currentDept = appointmentsByDept.find((d) => d._id === activeDept);

  const filtered = (currentDept?.appointments || []).filter((a) => {
    const matchSearch =
      `${a.patient?.firstName} ${a.patient?.lastName} ${a.token}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleDeptChange = (id) => {
    setActiveDept(id);
    setSearch('');
    setStatusFilter('all');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Appointments
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            All appointments grouped by department
          </p>
        </div>

        {/* Summary Row */}
        {!appointmentsLoading && appointmentsByDept.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: 'Total',
                value: appointmentsByDept.reduce(
                  (a, d) => a + d.totalAppointments,
                  0,
                ),
                color: 'text-slate-800',
              },
              {
                label: 'Completed',
                value: appointmentsByDept.reduce(
                  (a, d) => a + d.totalAppointmentsCompleted,
                  0,
                ),
                color: 'text-green-600',
              },
              {
                label: 'In Progress',
                value: appointmentsByDept.reduce(
                  (a, d) => a + d.totalAppointmentsInProgress,
                  0,
                ),
                color: 'text-blue-600',
              },
              {
                label: 'Cancelled',
                value: appointmentsByDept.reduce(
                  (a, d) => a + d.totalAppointmentsCancelled,
                  0,
                ),
                color: 'text-red-500',
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white border-2 border-slate-200 rounded-xl p-4 shadow-sm"
              >
                <p className={`text-2xl font-extrabold ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Department Tabs */}
        <div className="flex flex-wrap gap-2">
          {appointmentsByDept.map((dept) => (
            <button
              key={dept._id}
              onClick={() => handleDeptChange(dept._id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeDept === dept._id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {dept._id}
              <span
                className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  activeDept === dept._id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {dept.totalAppointments}
              </span>
            </button>
          ))}
        </div>

        {appointmentsLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : currentDept ? (
          <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Dept Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-2 h-6 bg-blue-600 rounded-sm" />
                <h2 className="text-base font-extrabold text-slate-800">
                  {currentDept._id}
                </h2>
                <div className="flex gap-3 text-xs font-semibold text-slate-500">
                  <span>
                    <span className="text-green-600 font-bold">
                      {currentDept.totalAppointmentsCompleted}
                    </span>{' '}
                    completed
                  </span>
                  <span>
                    <span className="text-red-500 font-bold">
                      {currentDept.totalAppointmentsCancelled}
                    </span>{' '}
                    cancelled
                  </span>
                  <span>
                    <span className="text-blue-600 font-bold">
                      {currentDept.totalAppointmentsInProgress}
                    </span>{' '}
                    in progress
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder="Search patient or token..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-400"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-400"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="checked_in">Checked In</option>
                  <option value="in_consultation">In Consultation</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-125">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Token
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Patient
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Date
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-12 text-center text-slate-400 text-sm"
                      >
                        No appointments found
                      </td>
                    </tr>
                  ) : (
                    paginated.map((appt, i) => (
                      <tr
                        key={i}
                        className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => setSelectedToken(appt.token)}
                            className="font-mono text-sm font-extrabold text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            #{appt.token}
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                              {appt.patient?.firstName?.[0]}
                              {appt.patient?.lastName?.[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 text-sm leading-none">
                                {appt.patient?.firstName}{' '}
                                {appt.patient?.lastName}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {appt.patient?.age} yrs
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-slate-600">
                          {formatDate(appt.scheduledDate)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_BADGE[appt.status] || STATUS_BADGE.pending}`}
                          >
                            {appt.status?.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50">
                <p className="text-xs text-slate-500">
                  {filtered.length} appointments · Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }).map(
                    (_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold ${page === i + 1 ? 'bg-blue-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-white'}`}
                      >
                        {i + 1}
                      </button>
                    ),
                  )}
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
        ) : (
          <div className="bg-white border-2 border-slate-200 rounded-2xl py-16 text-center text-slate-400 text-sm">
            No appointment data available
          </div>
        )}
      </div>

      {selectedToken && (
        <TokenModal
          token={selectedToken}
          onClose={() => setSelectedToken(null)}
        />
      )}
    </div>
  );
}