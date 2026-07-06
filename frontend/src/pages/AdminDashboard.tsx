import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Stethoscope, CalendarCheck, MessageSquare } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { api } from "../services/api";
import type { Analytics, UserOut, ChatMessage } from "../types";
import { Card } from "../components/ui/primitives";
import AnimatedCounter from "../components/ui/AnimatedCounter";

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#2563eb",
  completed: "#22c55e",
  cancelled: "#ef4444",
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<UserOut[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserOut | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);

  useEffect(() => {
    api.get<Analytics>("/api/admin/analytics").then((r) => setAnalytics(r.data));
    api.get<UserOut[]>("/api/admin/users").then((r) => setUsers(r.data));
  }, []);

  function viewHistory(user: UserOut) {
    setSelectedUser(user);
    api.get<ChatMessage[]>(`/api/admin/users/${user.id}/chat-history`).then((r) => setHistory(r.data));
  }

  const cards = analytics
    ? [
        { label: "Total Users", value: analytics.total_users, icon: Users, tone: "brand" },
        { label: "Doctors", value: analytics.total_doctors, icon: Stethoscope, tone: "care" },
        { label: "Appointments", value: analytics.total_appointments, icon: CalendarCheck, tone: "accent" },
        { label: "Chat Messages", value: analytics.total_chat_messages, icon: MessageSquare, tone: "brand" },
      ]
    : [];

  const pieData = analytics
    ? Object.entries(analytics.appointments_by_status).map(([status, count]) => ({ name: status, value: count }))
    : [];

  const barData = users.reduce<Record<string, number>>((acc, u) => {
    const month = new Date(u.created_at).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const barChartData = Object.entries(barData).map(([month, count]) => ({ month, count }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl font-bold text-ink-900 dark:text-white">
        Admin Dashboard
      </motion.h1>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="p-5" hover>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300">
                <c.icon size={18} />
              </span>
              <p className="mt-3 text-2xl font-bold text-ink-900 dark:text-white">
                <AnimatedCounter to={c.value} />
              </p>
              <p className="text-xs text-ink-500">{c.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <Card className="p-6" hover={false}>
          <h2 className="font-display font-semibold text-ink-900 dark:text-white mb-1">Appointments by status</h2>
          <p className="text-xs text-ink-500 mb-4">Live breakdown across the platform</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.name] || "#94a3b8"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {pieData.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5 text-xs text-ink-500 capitalize">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[d.name] || "#94a3b8" }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-6" hover={false}>
          <h2 className="font-display font-semibold text-ink-900 dark:text-white mb-1">New users by month</h2>
          <p className="text-xs text-ink-500 mb-4">Signup growth trend</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: "rgba(37,99,235,0.06)" }} />
                <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <Card className="p-5" hover={false}>
          <h2 className="font-display font-semibold text-ink-900 dark:text-white mb-3">Users</h2>
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-white/8">
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => viewHistory(u)}
                className={`w-full flex items-center justify-between px-2 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors ${
                  selectedUser?.id === u.id ? "bg-brand-50 dark:bg-brand-500/10" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-linear-to-br from-brand-500 to-care-500 text-white text-xs font-bold">
                    {u.full_name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink-900 dark:text-white">{u.full_name}</p>
                    <p className="text-xs text-ink-500">{u.email}</p>
                  </div>
                </div>
                <span className="text-xs rounded-full bg-slate-100 dark:bg-white/10 px-2 py-1 text-ink-500 capitalize">{u.role}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5" hover={false}>
          <h2 className="font-display font-semibold text-ink-900 dark:text-white mb-3">
            {selectedUser ? `Chat history — ${selectedUser.full_name}` : "Select a user to view chat history"}
          </h2>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {history.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${
                  m.sender === "user" ? "ml-auto bg-linear-to-r from-brand-600 to-accent-600 text-white" : "bg-slate-100 dark:bg-white/5 text-ink-700 dark:text-ink-200"
                }`}
              >
                {m.content}
              </div>
            ))}
            {selectedUser && history.length === 0 && (
              <p className="text-sm text-ink-500 text-center py-6">No chat history for this user yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
