export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#eadbd5] bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="font-serif text-3xl font-bold">
          The <span className="text-rose">Lash</span> Haus
        </a>
        <div className="hidden items-center gap-6 text-sm md:flex">
          <a href="/#treatments">Treatments</a>
          <a href="/gallery">Gallery</a>
          <a href="/book">Book</a>
          <a href="/reviews">Reviews</a>
          <a href="/contact">Contact</a>
          <a href="/admin" className="rounded-full bg-ink px-5 py-3 font-bold text-white">Admin</a>
        </div>
      </div>
    </nav>
  );
}
