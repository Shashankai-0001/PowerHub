// Macro Nutrition Chart Component using Chart.js
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function MacroChart({ data }) {
    if (!data || data.length === 0) return <div className="h-[200px] flex items-center justify-center text-muted-foreground">No data available</div>;

    return (
        <div>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="text-sm font-bold text-foreground">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
