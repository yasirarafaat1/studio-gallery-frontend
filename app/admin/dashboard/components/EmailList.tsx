"use client";

type Client = {
  _id: string;
  email: string;
  role: "admin" | "client";
};

type Props = {
  clients: Client[];
};

export default function EmailList({ clients }: Props) {
  const onlyClients = clients.filter((client) => client.role === "client");

  return (
    <div className="glass p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Client emails</p>
        <span className="text-xs text-[var(--muted)]">{onlyClients.length}</span>
      </div>
      <div className="mt-4 space-y-2">
        {onlyClients.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No clients yet.</p>
        ) : null}
        {onlyClients.map((client) => (
          <div
            key={client._id}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90"
          >
            {client.email}
          </div>
        ))}
      </div>
    </div>
  );
}