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
    <div className="dashboard-charts-layout-grid">
      
      {/* Status Chart */}
      <div className="chart-card-box">
        <h3 className="chart-title">📊 Ticket Status Breakdown</h3>
        <div className="responsive-chart-frame">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                innerRadius={55}
                outerRadius={75}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={45} wrapperStyle={{ position: 'relative', fontSize: "1.4rem", paddingTop: "10px" }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Chart */}
      <div className="chart-card-box">
        <h3 className="chart-title">🎯 Volume by Priority</h3>
        <div className="responsive-chart-frame">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 14 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 14 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="var(--btn-color)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Chart */}
      <div className="chart-card-box">
        <h3 className="chart-title">📁 Support Category Distribution</h3>
        <div className="responsive-chart-frame">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={categoryData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
              <XAxis type="number" stroke="#94a3b8" hide />
              <YAxis dataKey="name" type="category" stroke="#e2e8f0" width={110} tick={{ fontSize: 13, fontWeight: 'bold' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SLA Trend Chart */}
      <div className="chart-card-box">
        <h3 className="chart-title">📈 SLA Compliance Trend</h3>
        <div className="responsive-chart-frame">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalTrend.length > 0 ? historicalTrend : [
               { date: 'Today', slaComplianceRate: data.slaComplianceRate }
            ]} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 13 }} tickFormatter={(str) => historicalTrend.length > 0 ? new Date(str).toLocaleDateString() : str} />
              <YAxis stroke="#94a3b8" domain={[0, 100]} tick={{ fontSize: 13 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="slaComplianceRate" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ r: 5 }} 
                activeDot={{ r: 7 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style>{`
        /* 💻 DEFAULT DESKTOP/LAPTOP GRID WRAPPER */
        .dashboard-charts-layout-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 3rem;
          margin-top: 1rem;
          width: 100%;
        }

        .chart-card-box {
          background: #1e293b;
          padding: 2.5rem;
          border-radius: 1rem;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .chart-title {
          color: white;
          margin-bottom: 1.5rem;
          font-size: 2.2rem;
        }

        .responsive-chart-frame {
          width: 100%;
          height: 350px; /* Perfectly scales chart height bounds inside cards */
          position: relative;
        }

        /* 📱 RESPONSIVE LAYOUT OPTIMIZATIONS FOR MOBILE VIEWPORTS */
        @media (max-width: 992px) {
          .dashboard-charts-layout-grid {
            grid-template-columns: 1fr; /* Stacks charts completely into single column blocks */
            gap: 2rem;
          }

          .chart-card-box {
            padding: 1.5rem;
          }

          .chart-title {
            font-size: 1.8rem;
            margin-bottom: 1rem;
          }

          .responsive-chart-frame {
            height: 280px; /* Slims down heights on small phones to maximize readability */
          }
        }
      `}</style>
    </div>
  );
};