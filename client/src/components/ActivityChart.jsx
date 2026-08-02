import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ActivityChart({ data }) {
    if (!data || data.length === 0) return <div className="h-[250px] flex items-center justify-center text-muted-foreground">No data available</div>;

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#f8fafc'
                    }}
                    cursor={{ fill: 'rgba(204, 255, 0, 0.1)' }}
                />
                <Bar
                    dataKey="minutes"
                    fill="url(#colorGradient)"
                    radius={[8, 8, 0, 0]}
                    animationBegin={0}
                    animationDuration={1000}
                />
                <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#CCFF00" stopOpacity={1} />
                        <stop offset="100%" stopColor="#00F0FF" stopOpacity={0.8} />
                    </linearGradient>
                </defs>
            </BarChart>
        </ResponsiveContainer>
    );
}
