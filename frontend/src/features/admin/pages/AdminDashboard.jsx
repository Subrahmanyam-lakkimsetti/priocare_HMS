import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Label,
  LabelList,
} from 'recharts';
import {
  fetchStats,
  fetchTodayStats,
  fetchFrequentPatients,
  fetchAppointmentsByDepartment,
} from '../adminThunks';

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div
      className={`bg-white border-2 ${color} rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.replace('border-', 'bg-').replace('-200', '-50')}`}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl font-extrabold text-slate-900 mb-0.5">
        {value ?? '—'}
      </p>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

function TodayCard({ label, value, accent }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between">
      <span className="text-sm text-slate-600 font-medium">{label}</span>
      <span className={`text-lg font-extrabold ${accent || 'text-slate-900'}`}>
        {value ?? 0}
      </span>
    </div>
  );
}

const DEPT_COLORS = [
  '#2563eb',
  '#7c3aed',
  '#059669',
  '#d97706',
  '#dc2626',
  '#0891b2',
];

/* ── Value label rendered above each bar ── */
function BarTopLabel({ x, y, width, value }) {
  if (!value) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 5}
      fill="#64748b"
      textAnchor="middle"
      fontSize={10}
      fontWeight={700}
    >
      {value}
    </text>
  );
}

/* ── Center total label inside donut ── */
function PieCenterLabel({ viewBox, total }) {
  const { cx, cy } = viewBox;
  return <text textAnchor="middle" dominantBaseline="central"></text>;
}

/* ── Outer value label on each pie slice ── */
function PieOuterLabel({ cx, cy, midAngle, outerRadius, value }) {
  if (!value) return null;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
      fill="#475569"
    >
      {value}
    </text>
  );
}

/* ── Rich bar chart tooltip ── */
function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const fullName = payload[0]?.payload?.fullName || label;
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '10px 14px',
        boxShadow: '0 4px 20px rgba(0,0,0,.08)',
        fontSize: 12,
        minWidth: 150,
      }}
    >
      <p
        style={{
          fontWeight: 700,
          color: '#0f172a',
          marginBottom: 8,
          fontSize: 13,
        }}
      >
        {fullName}
      </p>
      {payload.map((p) => (
        <div
          key={p.name}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 3,
          }}
        >
          <span
            style={{
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              textTransform: 'capitalize',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: p.fill,
                display: 'inline-block',
              }}
            />
            {p.name}
          </span>
          <span style={{ fontWeight: 800, color: '#0f172a' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const {
    stats,
    todayStats,
    frequentPatients,
    appointmentsByDept,
    statsLoading,
  } = useSelector((s) => s.admin);
  const [mounted, setMounted] = useState(false);

  const todayDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  useEffect(() => {
    setMounted(true);
    dispatch(fetchStats());
    dispatch(fetchTodayStats(todayDate));
    dispatch(fetchFrequentPatients());
    dispatch(fetchAppointmentsByDepartment());
  }, [dispatch]);

  const deptChartData = (appointmentsByDept || []).map((d) => ({
    name: d._id.length > 12 ? d._id.substring(0, 10) + '..' : d._id,
    fullName: d._id,
    total: d.totalAppointments,
    completed: d.totalAppointmentsCompleted,
    cancelled: d.totalAppointmentsCancelled,
  }));

  const PIE_COLORS = ['#059669', '#2563eb', '#dc2626'];

  const pieData = [
    {
      name: 'Completed',
      value: (appointmentsByDept || []).reduce(
        (a, d) => a + d.totalAppointmentsCompleted,
        0,
      ),
    },
    {
      name: 'In Progress',
      value: (appointmentsByDept || []).reduce(
        (a, d) => a + d.totalAppointmentsInProgress,
        0,
      ),
    },
    {
      name: 'Cancelled',
      value: (appointmentsByDept || []).reduce(
        (a, d) => a + d.totalAppointmentsCancelled,
        0,
      ),
    },
  ].filter((d) => d.value > 0);

  const pieTotal = pieData.reduce((a, d) => a + d.value, 0);

  return (
    <div
      className={`min-h-screen bg-slate-100 p-6 md:p-8 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Admin Dashboard 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Full overview of PrioCare HMS operations
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-full py-2 px-4 text-sm font-bold text-blue-600 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Live
          </div>
        </div>

        {/* KPI Cards */}
        <div>
          <SectionLabel>Overall Statistics</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard
              label="Total Doctors"
              value={stats?.totalDoctors}
              color="border-blue-200"
              icon={
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#2563eb"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
            />
            <StatCard
              label="Receptionists"
              value={stats?.totalReceptionists}
              color="border-purple-200"
              icon={
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#7c3aed"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              }
            />
            <StatCard
              label="Total Patients"
              value={stats?.totalPatients}
              color="border-green-200"
              icon={
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#059669"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
                  />
                </svg>
              }
            />
            <StatCard
              label="Total Appointments"
              value={stats?.totalAppointments}
              color="border-amber-200"
              icon={
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#d97706"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
            />
            <StatCard
              label="Cancelled"
              value={stats?.totalAppointmentsCanceled}
              color="border-red-200"
              icon={
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#dc2626"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              }
            />
          </div>
        </div>

        {/* Today Stats */}
        <div>
          <SectionLabel>Today's Live Stats — {todayDate}</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <TodayCard
              label="Total Appointments"
              value={todayStats?.totalAppointmentsToday}
            />
            <TodayCard
              label="New Patients"
              value={todayStats?.newPatientsToday}
              accent="text-blue-600"
            />
            <TodayCard
              label="Checked In"
              value={todayStats?.totalCheckInPatientsToday}
              accent="text-amber-600"
            />
            <TodayCard
              label="In Consultation"
              value={todayStats?.totalInConsultationNow}
              accent="text-purple-600"
            />
            <TodayCard label="Waiting" value={todayStats?.waitingPatientsNow} />
            <TodayCard
              label="Completed"
              value={todayStats?.totalCompletedConsultations}
              accent="text-green-600"
            />
            <TodayCard
              label="Cancelled Today"
              value={todayStats?.todayAppointmentsCanelled}
              accent="text-red-500"
            />
          </div>
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-800 mb-1">
              Appointments by Department
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Total vs completed vs cancelled
            </p>

            {/* inline legend */}
            <div className="flex items-center gap-4 mb-4">
              {[
                { fill: '#dbeafe', label: 'Total' },
                { fill: '#2563eb', label: 'Completed' },
                { fill: '#fca5a5', label: 'Cancelled' },
              ].map(({ fill, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      background: fill,
                      display: 'inline-block',
                    }}
                  />
                  <span className="text-xs font-semibold text-slate-500">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {deptChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={deptChartData}
                  barGap={3}
                  barSize={14}
                  margin={{ top: 20, right: 8, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip
                    content={<CustomBarTooltip />}
                    cursor={{ fill: '#f8fafc', radius: 6 }}
                  />
                  {/* Total bar with number on top */}
                  <Bar
                    dataKey="total"
                    fill="#dbeafe"
                    radius={[4, 4, 0, 0]}
                    name="total"
                  >
                    <LabelList content={<BarTopLabel />} />
                  </Bar>
                  {/* Completed bar */}
                  <Bar
                    dataKey="completed"
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                    name="completed"
                  >
                    <LabelList content={<BarTopLabel />} />
                  </Bar>
                  {/* Cancelled bar */}
                  <Bar
                    dataKey="cancelled"
                    fill="#fca5a5"
                    radius={[4, 4, 0, 0]}
                    name="cancelled"
                  >
                    <LabelList content={<BarTopLabel />} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-slate-300 text-sm">
                Loading chart...
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-800 mb-1">
              Appointment Status
            </h3>
            <p className="text-xs text-slate-400 mb-4">Overall distribution</p>

            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart
                    margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
                  >
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={72}
                      dataKey="value"
                      paddingAngle={3}
                      labelLine={false}
                      label={<PieOuterLabel />}
                    >
                      {pieData.map((entry, i) => (
                        <Cell
                          key={entry.name}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                      <Label
                        content={<PieCenterLabel total={pieTotal} />}
                        position="center"
                      />
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #e2e8f0',
                        fontSize: 12,
                      }}
                      formatter={(value, name) => [
                        `${value} (${pieTotal > 0 ? Math.round((value / pieTotal) * 100) : 0}%)`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* legend with count + % pill */}
                <div className="mt-2 space-y-2.5">
                  {pieData.map((d, i) => (
                    <div
                      key={d.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            width: 9,
                            height: 9,
                            borderRadius: '50%',
                            background: PIE_COLORS[i],
                            display: 'inline-block',
                            flexShrink: 0,
                          }}
                        />
                        <span className="text-xs font-medium text-slate-600">
                          {d.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-800">
                          {d.value}
                        </span>
                        <span
                          className="text-xs font-bold rounded-full px-2 py-0.5"
                          style={{
                            background: PIE_COLORS[i] + '1a',
                            color: PIE_COLORS[i],
                          }}
                        >
                          {pieTotal > 0
                            ? Math.round((d.value / pieTotal) * 100)
                            : 0}
                          %
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-60 flex items-center justify-center text-slate-300 text-sm">
                No data
              </div>
            )}
          </div>
        </div>

        {/* Frequent Patients */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <SectionLabel className="mb-0">
              Frequently Visited Patients
            </SectionLabel>
            <button
              onClick={() => nav('/admin/patients')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View all →
            </button>
          </div>
          <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    #
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Patient
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Blood
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Phone
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Visits
                  </th>
                </tr>
              </thead>
              <tbody>
                {(frequentPatients || []).slice(0, 8).map((p, i) => (
                  <tr
                    key={p._id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-3 text-xs text-slate-400 font-medium">
                      {i + 1}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600 shrink-0">
                          {p.firstName?.[0]}
                          {p.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 leading-none">
                            {p.firstName} {p.lastName}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {p.age} yrs · {p.gender}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                        {p.bloodGroup}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600 font-mono text-xs">
                      {p.phoneNumber}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-extrabold text-blue-600">
                        {p.totalAppointments}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Nav Cards */}
        <div>
          <SectionLabel>Quick Navigation</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: 'Staff Management',
                sub: 'Doctors & receptionists',
                path: '/admin/staff',
                color: 'from-blue-600 to-blue-700',
              },
              {
                label: 'Patient Records',
                sub: 'All patient data',
                path: '/admin/patients',
                color: 'from-slate-700 to-slate-800',
              },
              {
                label: 'Appointments',
                sub: 'By department',
                path: '/admin/appointments',
                color: 'from-violet-600 to-violet-700',
              },
            ].map((c) => (
              <div
                key={c.path}
                onClick={() => nav(c.path)}
                className={`bg-linear-to-br ${c.color} rounded-2xl p-6 cursor-pointer group hover:-translate-y-1 transition-all duration-200 shadow-lg`}
              >
                <h3 className="text-lg font-extrabold text-white mb-1">
                  {c.label}
                </h3>
                <p className="text-sm text-white/60">{c.sub}</p>
                <div className="mt-4 flex items-center gap-1 text-white/80 text-xs font-bold group-hover:gap-2 transition-all">
                  Open <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children, className = '' }) {
  return (
    <p
      className={`text-xs font-bold tracking-widest uppercase text-slate-500 mb-3 flex items-center gap-2 ${className}`}
    >
      <span className="w-1 h-4 bg-blue-600 rounded-sm" />
      {children}
    </p>
  );
}