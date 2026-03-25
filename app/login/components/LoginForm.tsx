"use client";

import { useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { setAuth } from "../../lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async () => {
    if (!email || loading) return;
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      await apiFetch("/api/auth/client/request-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setStatus("OTP sent to your email.");
    } catch (err) {
      setError((err as Error).message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!email || !otp || loading) return;
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const data = await apiFetch("/api/auth/client/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });
      if (data?.token && data?.user) {
        setAuth(data.token, data.user);
        router.push("/gallery");
      }
    } catch (err) {
      setError((err as Error).message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleRequestOtp();
    }
  };

  const handleOtpKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleVerify();
    }
  };

  return (
    <div className="glass p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">OTP login</p>
          <h2 className="section-title mt-2 text-2xl">Client access</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70">
          Read only
        </span>
      </div>
      <div className="mt-6 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Email</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onKeyDown={handleEmailKeyDown}
            placeholder="you@example.com"
            className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-white/30"
          />
        </div>
        <button
          onClick={handleRequestOtp}
          disabled={!email || loading}
          className="w-full rounded-2xl bg-white py-3 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
        <div className="grid gap-3">
          <label className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">OTP Code</label>
          <input
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            onKeyDown={handleOtpKeyDown}
            placeholder="6 digit OTP"
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-white/30"
          />
        </div>
        <button
          onClick={handleVerify}
          disabled={!email || !otp || loading}
          className="w-full rounded-2xl border border-white/20 py-3 text-sm font-semibold text-white/90 transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify and Login"}
        </button>
      </div>
      {status ? <p className="mt-4 text-xs text-emerald-300">{status}</p> : null}
      {error ? <p className="mt-4 text-xs text-red-300">{error}</p> : null}
      <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-[var(--muted)]">
        OTP expires in 10 minutes. For help, contact your studio manager.
      </div>
    </div>
  );
}