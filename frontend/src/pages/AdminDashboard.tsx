import { useEffect, useState } from "react";
import { Users, Stethoscope, CalendarCheck, MessageSquare } from "lucide-react";
import { api } from "../services/api";
import type { Analytics, UserOut, ChatMessage } from "../types";

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
        { label: "Total Users", value: analytics.total_users, icon: Users },
        { label: "Doctors", value: analytics.total_doctors, icon: Stethoscope },
        { label: "Appointments", value: analytics.total_appointments, icon: CalendarCheck },
        { label: "Chat Messages", value: analytics.total_chat_messages, icon: MessageSquare },
      ]
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-2xl font-bold text-ink-900">Admin Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <c.icon size={18} />
            </span>
            <p className="mt-3 text-2xl font-bold text-ink-900">{c.value}</p>
            <p className="text-xs text-ink-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="font-display font-semibold text-ink-900 mb-3">Users</h2>
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => viewHistory(u)}
                className={`w-full flex items-center justify-between px-2 py-3 text-left hover:bg-slate-50 rounded-lg ${
                  selectedUser?.id === u.id ? "bg-brand-50" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-ink-900">{u.full_name}</p>
                  <p className="text-xs text-ink-500">{u.email}</p>
                </div>
                <span className="text-xs rounded-full bg-slate-100 px-2 py-1 text-ink-500 capitalize">{u.role}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="font-display font-semibold text-ink-900 mb-3">
            {selectedUser ? `Chat history — ${selectedUser.full_name}` : "Select a user to view chat history"}
          </h2>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {history.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${
                  m.sender === "user" ? "ml-auto bg-brand-500 text-white" : "bg-slate-100 text-ink-700"
                }`}
              >
                {m.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
