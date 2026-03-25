"use client";

import { useEffect, useState } from "react";
import { apiFetchAdmin } from "../../../lib/api";
import AdminShell from "../../components/AdminShell";
import EmailList from "./EmailList";

type Client = {
  _id: string;
  email: string;
  role: "admin" | "client";
};

type StatsRowProps = {
  clients: Client[];
};

const StatsRow = ({ clients }: StatsRowProps) => {
  const totalClients = clients.filter((client) => client.role === "client");
  const stats = [{ label: "Total clients", value: totalClients.length }];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="glass p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">{stat.label}</p>
          <p className="section-title mt-2 text-2xl text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default function AdminDashboardShell() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetchAdmin("/api/users");
      setClients(data.users || []);
    } catch (err) {
      setError((err as Error).message || "Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  return (
    <AdminShell title="Dashboard" subtitle="View client emails and assign galleries from Gallery tab.">
      {loading ? <div className="glass p-6 text-sm text-[var(--muted)]">Loading clients...</div> : null}
      {error ? <div className="glass p-6 text-sm text-red-300">{error}</div> : null}
      {!loading && !error ? (
        <div className="flex flex-col gap-6">
          <StatsRow clients={clients} />
          <EmailList clients={clients} />
        </div>
      ) : null}
    </AdminShell>
  );
}
