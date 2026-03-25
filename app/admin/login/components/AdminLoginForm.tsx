"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetchPublic } from "../../../lib/api";
import { setAdminAuth } from "../../../lib/auth";

export default function AdminLoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password || loading) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetchPublic("/api/auth/admin/login", {
        method: "POST",
        body: JSON.stringify({
          email: identifier,
          username: identifier,
          password,
        }),
      });
      if (data?.token && data?.user) {
        setAdminAuth(data.token, data.user);
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError((err as Error).message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleLogin();
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-6">
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Email or username</label>
          <input
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-white/30"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-white/30"
          />
        </div>
        <button
          type="submit"
          disabled={!identifier || !password || loading}
          className="rounded-2xl bg-white py-3 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
        {error ? <p className="text-xs text-red-300">{error}</p> : null}
      </div>
    </form>
  );
}
