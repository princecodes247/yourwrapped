import { useQuery } from "@tanstack/react-query";
import { getAllWrapped } from "@/api/wrapped";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, AreaChart, Area } from "recharts";
import { Loader2, Users, Palette, Calendar, TrendingUp, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["wraps"],
        queryFn: async () => {
            return await getAllWrapped();

        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
            </div>
        );
    }

    if (error) {
        return (
            <Navigate to="/admin/login" />
        );
    }

    if (!data) return null;

    // Custom Card Component for Glassmorphism
    const GlassCard = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
        <Card className={cn(
            "bg-zinc-900/40 backdrop-blur-md border-white/5 shadow-xl hover:bg-zinc-900/60 hover:border-white/10 transition-all duration-500 animate-fade-up opacity-0 group relative overflow-hidden",
            className
        )} style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10">
                {children}
            </div>
        </Card>
    );

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black relative overflow-hidden p-8 text-white">
            {/* Ambient glow effect */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow opacity-40"
                />
                <div
                    className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] animate-pulse-glow delay-700 opacity-20"
                />
            </div>

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                <div className="animate-fade-up opacity-0" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="text-xs font-medium text-zinc-300 uppercase tracking-wider">Admin Dashboard</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                        Wrapped <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Overview</span>
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-2xl font-light leading-relaxed">
                        Track the pulse of your users' year. See what themes, eras, and moments are resonating the most.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <GlassCard delay={100}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total Wraps</CardTitle>
                            <Users className="h-4 w-4 text-primary/50" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-medium counter-reveal text-zinc-100">{data?.totalWraps}</div>
                        </CardContent>
                    </GlassCard>
                    <GlassCard delay={200}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Top Theme</CardTitle>
                            <Palette className="h-4 w-4 text-primary/50" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-medium capitalize text-zinc-100 truncate">{data?.topTheme?._id}</div>
                        </CardContent>
                    </GlassCard>
                    <GlassCard delay={300}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Top Era</CardTitle>
                            <TrendingUp className="h-4 w-4 text-primary/50" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-medium capitalize truncate text-zinc-100">
                                {data?.topEra?._id || 'N/A'}
                            </div>
                        </CardContent>
                    </GlassCard>
                    <GlassCard delay={400}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Top Music</CardTitle>
                            <Calendar className="h-4 w-4 text-primary/50" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-medium counter-reveal text-zinc-100 truncate">
                                {data?.topMusic?._id || 'None'}
                            </div>
                        </CardContent>
                    </GlassCard>
                </div>

                {/* Wraps Over Time Chart */}
                <GlassCard className="col-span-2" delay={700}>
                    <CardHeader>
                        <CardTitle className="text-base font-medium text-zinc-200">Wraps Created Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.wrapsOverTime}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="_id"
                                        stroke="#52525b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                        tickFormatter={(value) => `${new Date(value).toLocaleDateString()}`}
                                    />
                                    <YAxis
                                        stroke="#52525b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(9, 9, 11, 0.9)',
                                            borderColor: 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(8px)',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                                            color: '#fff'
                                        }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorCount)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </GlassCard>

                {/* Charts Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    <GlassCard className="col-span-1" delay={500}>
                        <CardHeader>
                            <CardTitle className="text-base font-medium text-zinc-200">Theme Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data?.themeDistribution || []}>
                                        <XAxis
                                            dataKey="_id"
                                            stroke="#52525b"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                        />
                                        <YAxis
                                            dataKey="count"
                                            stroke="#52525b"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(9, 9, 11, 0.9)',
                                                borderColor: 'rgba(255, 255, 255, 0.05)',
                                                backdropFilter: 'blur(8px)',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                                                color: '#fff'
                                            }}
                                            itemStyle={{ color: '#fff' }}
                                            cursor={{ fill: 'rgba(255, 255, 255, 0.02)', radius: 4 }}
                                        />
                                        <Bar
                                            dataKey="count"
                                            fill="hsl(var(--primary))"
                                            radius={[4, 4, 0, 0]}
                                            className="hover:opacity-80 transition-opacity duration-300"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </GlassCard>

                    <GlassCard className="col-span-1" delay={600}>
                        <CardHeader>
                            <CardTitle className="text-base font-medium text-zinc-200">Top Eras</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data?.topEras} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="_id"
                                            type="category"
                                            stroke="#52525b"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            width={100}
                                            tickFormatter={(value) => value.replace(/-/g, ' ')}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(9, 9, 11, 0.9)',
                                                borderColor: 'rgba(255, 255, 255, 0.05)',
                                                backdropFilter: 'blur(8px)',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                                                color: '#fff'
                                            }}
                                            itemStyle={{ color: '#fff' }}
                                            cursor={{ fill: 'rgba(255, 255, 255, 0.02)', radius: 4 }}
                                        />
                                        <Bar
                                            dataKey="count"
                                            fill="hsl(var(--accent))"
                                            radius={[0, 4, 4, 0]}
                                            className="hover:opacity-80 transition-opacity duration-300"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
