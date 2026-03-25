"use client";

import { apiFetchAdmin } from "../../../lib/api";

type Client = {
  _id: string;
  email: string;
  name?: string;
  approved?: boolean;
  role: "admin" | "client";
};

type Props = {
  clients: Client[];
  onUpdated: () => void;
};

export default function ClientList({ clients, onUpdated }: Props) {
  const handleApprove = async (id: string, approved: boolean) => {
    await apiFetchAdmin(`/api/users/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ approved }),
    });
    onUpdated();
  };

  const onlyClients = clients.filter((client) => client.role === "client");

  return (
    <div className="glass p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Clients</p>
        <span className="text-xs text-[var(--muted)]">{onlyClients.length}</span>
      </div>
      <div className="mt-4 space-y-3">
        {onlyClients.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No clients yet.</p>
        ) : null}
        {onlyClients.map((client) => (
          <div key={client._id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div>
              <p className="text-sm text-white/90">{client.email}</p>
              {client.name ? <p className="text-xs text-[var(--muted)]">{client.name}</p> : null}
            </div>
            <button
              onClick={() => handleApprove(client._id, !client.approved)}
              className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
                client.approved
                  ? "border border-emerald-300/40 text-emerald-200"
                  : "border border-white/20 text-white/70"
              }`}
            >
              {client.approved ? "Approved" : "Pending"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
