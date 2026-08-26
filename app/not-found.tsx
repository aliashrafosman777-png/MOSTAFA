import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="container-site text-center">
        <p className="text-label mb-4">404</p>
        <h1 className="text-display-lg text-white mb-6">
          This route does not exist.
        </h1>
        <p className="text-body mx-auto mb-10 text-center">
          The page you are looking for may have been moved or does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-carbon font-semibold text-sm tracking-wide hover:bg-ivory transition-colors duration-300 rounded-sm"
        >
          Return home
        </Link>
      </div>
    </section>
  );
}
