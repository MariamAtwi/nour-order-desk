
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#422D20]">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/nour-studio.jpg')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#24170F]/45" />

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center text-white">

        <p className="mb-6 text-xs font-medium uppercase tracking-[0.35em] text-[#F0D9BD] sm:text-sm">
          Handmade with love · Beirut, Lebanon
        </p>

        <h1 className="font-cinzel text-5xl font-medium uppercase tracking-wide sm:text-7xl">
          Nour Candle Studio
        </h1>

       <p className="font-cormorant text-2xl leading-relaxed sm:text-3xl">
        Light up your moments with our handcrafted candles.
        </p>

        <Link
          href="/dashboard"
          className="font-cinzel mt-10 inline-flex items-center justify-center border border-[#F0D9BD] bg-[#E8D6C1] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-[#422D20] transition duration-300 hover:bg-[#422D20] hover:text-[#F8F0E6]"
        >
          Explore Order Dashboard
          <span className="ml-3">→</span>
        </Link>

      </div>
    </main>
  );
}
