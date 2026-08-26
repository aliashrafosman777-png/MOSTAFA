export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-runway to-transparent animate-pulse" />
        <p className="text-xs text-sage tracking-widest uppercase">Loading</p>
      </div>
    </div>
  );
}
