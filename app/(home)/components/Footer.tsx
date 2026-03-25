export default function Footer() {
  return (
    <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[var(--muted)] sm:flex-row">
      <p>Studio Gallery (c) 2026</p>
      <div className="flex items-center gap-4">
        <span>Privacy-first delivery</span>
        <span className="h-1 w-1 rounded-full bg-white/30" />
        <span>Support: hello@studio.com</span>
      </div>
    </footer>
  );
}