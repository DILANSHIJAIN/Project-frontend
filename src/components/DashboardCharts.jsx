import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line
} from 'recharts';

export const DashboardCharts = ({ data, historicalTrend = [] }) => {
  if (!data) return null;

  // 1. Status Distribution (Donut Chart)
  const statusData = [
    { name: 'Open', value: data.statusDistribution?.Open || 0, color: '#ef4444' },
    { name: 'In-Progress', value: data.statusDistribution?.['In-Progress'] || 0, color: '#f97316' },
    { name: 'Closed', value: data.statusDistribution?.Closed || 0, color: '#10b981' },
  ];

  // 2. Priority Distribution (Bar Chart)
  const priorityData = Object.entries(data.priorityDistribution || {}).map(([name, value]) => ({
    name,
    count: value,
  }));

  // 3. Category Distribution (Horizontal Bar Chart)
  const categoryData = Object.entries(data.categoryDistribution || {}).map(([name, value]) => ({
    name,
    count: value,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#1e293b', border: '1px solid #475569', padding: '1rem', borderRadius: '0.5rem' }}>
          <p style={{ color: 'white', margin: 0 }}>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-two-cols" style={{ gap: "3rem", marginTop: "1rem", minHeight: "1000px" }}>
      
      {/* Status Chart */}
      <div style={{ background: "#1e293b", padding: "3rem", borderRadius: "1rem", height: "450px" }}>
        <h3 style={{ color: "white", marginBottom: "2rem", fontSize: "2.4rem" }}>📊 Ticket Status Breakdown</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "2rem", paddingTop: "25px" }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Priority Chart */}
      <div style={{ background: "#1e293b", padding: "3rem", borderRadius: "1rem", height: "450px" }}>
        <h3 style={{ color: "white", marginBottom: "2rem", fontSize: "2.4rem" }}>🎯 Volume by Priority</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={priorityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 20 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 20 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="var(--btn-color)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Chart */}
      <div style={{ background: "#1e293b", padding: "3rem", borderRadius: "1rem", height: "450px" }}>
        <h3 style={{ color: "white", marginBottom: "2rem", fontSize: "2.4rem" }}>📁 Support Category Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
            <XAxis type="number" stroke="#94a3b8" hide />
            <YAxis dataKey="name" type="category" stroke="#e2e8f0" width={180} tick={{ fontSize: 24, fontWeight: 'bold' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SLA Trend Chart (Uses historical data if provided) */}
      <div style={{ background: "#1e293b", padding: "3rem", borderRadius: "1rem", height: "450px" }}>
        <h3 style={{ color: "white", marginBottom: "2rem", fontSize: "2.2rem" }}>📈 SLA Compliance Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historicalTrend.length > 0 ? historicalTrend : [
             { date: 'Today', slaComplianceRate: data.slaComplianceRate }
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 16 }} tickFormatter={(str) => historicalTrend.length > 0 ? new Date(str).toLocaleDateString() : str} />
            <YAxis stroke="#94a3b8" domain={[0, 100]} tick={{ fontSize: 16 }} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="slaComplianceRate" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ r: 6 }} 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};