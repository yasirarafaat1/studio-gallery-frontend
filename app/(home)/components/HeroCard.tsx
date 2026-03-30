"use client";

import { useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { setAuth } from "../../lib/auth";

const steps = [
  { title: "Client enters email", meta: "OTP sent instantly" },
  { title: "OTP verification", meta: "Single-use code" },
  { title: "Gallery unlocked", meta: "Read-only access" },
];

export default function HeroCard() {
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

  const handlePrimary = () => {
    if (otp) handleVerify();
    else handleRequestOtp();
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
    <div className="glass relative overflow-hidden p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="section-title text-2xl">Login panel</h3>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Email</p>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onKeyDown={handleEmailKeyDown}
            placeholder="you@example.com"
            className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30"
          />
          <div className="mt-3 flex flex-col md:flex-row items-center gap-2">
            <input
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              onKeyDown={handleOtpKeyDown}
              placeholder="OTP"
              className="h-10 w-full flex-1 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30"
            />
            <button
              type="button"
              onClick={handlePrimary}
              disabled={!email || loading}
              className="h-10 w-28 rounded-xl bg-white text-xs font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : otp ? "Login" : "Send OTP"}
            </button>
          </div>
          {status ? <p className="mt-3 text-xs text-emerald-300">{status}</p> : null}
          {error ? <p className="mt-3 text-xs text-red-300">{error}</p> : null}
        </div>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-white/90">{step.title}</p>
                <p className="text-xs text-[var(--muted)]">{step.meta}</p>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-xs text-white/70">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-16 -right-12 h-40 w-40 rounded-full bg-[var(--accent-2)]/30 blur-3xl" />
    </div>
  );
}
