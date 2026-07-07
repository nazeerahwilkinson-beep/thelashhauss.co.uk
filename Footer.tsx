export default function Footer() {
  return (
    <footer className="mt-16 bg-[#2c211f] px-6 py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row">
        <div>
          <p className="font-serif text-3xl font-bold">The <span className="text-rose">Lash</span> Haus</p>
          <p className="mt-3 text-[#eadbd5]">Luxury lashes in Birmingham.</p>
        </div>
        <div className="max-w-md">
          <p className="font-bold">Cancellation Policy</p>
          <p className="mt-2 text-[#eadbd5]">Free cancellation up to 48 hours before appointment. Refunds inside 48 hours are manually reviewed by admin.</p>
        </div>
      </div>
    </footer>
  );
}
