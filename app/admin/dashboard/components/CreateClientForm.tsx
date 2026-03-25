"use client";

import { useState } from "react";
import { apiFetchAdmin } from "../../../lib/api";

type Props = {
  onCreated: () => void;
};

export default function CreateClientForm({ onCreated }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!email || loading) return;
    setLoading(true);
    setMessage(null);
    try {
      await apiFetchAdmin("/api/users", {
        method: "POST",
        body: JSON.stringify({ email, name, role: "client", approved }),
      });
      setMessage("Client created.");
      setEmail("");
      setName("");
      setApproved(false);
      onCreated();
    } catch (err) {
      setMessage((err as Error).message || "Failed to create client.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCreate();
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-6">
      <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Create client</p>
      <div className="mt-4 grid gap-3">
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Client email"
          className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-white/30"
        />
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Client name (optional)"
          className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-white/30"
        />
        <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <input
            type="checkbox"
            checked={approved}
            onChange={(event) => setApproved(event.target.checked)}
          />
          Approve immediately
        </label>
        <button
          type="submit"
          disabled={!email || loading}
          className="rounded-2xl bg-white py-2 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create client"}
        </button>
        {message ? <p className="text-xs text-white/70">{message}</p> : null}
      </div>
    </form>
  );
}
