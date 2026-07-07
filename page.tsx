export default function AdminPage() {
  const cards = [
    ["Bookings", "12"],
    ["Pending Reviews", "3"],
    ["Messages", "5"],
    ["Revenue Preview", "£420"]
  ];

  return (
    <main className="grid min-h-screen bg-cream md:grid-cols-[280px_1fr]">
      <aside className="bg-[#2c211f] p-6 text-white">
        <a href="/" className="font-serif text-3xl font-bold">The <span className="text-rose">Lash</span> Haus</a>
        <p className="mt-3 text-[#dccbc2]">Admin Control</p>
        <nav className="mt-8 grid gap-2">
          {["Dashboard", "Website Builder", "Booking Slots", "Bookings", "Reviews", "Messages", "Payments", "Settings"].map((item) => (
            <button key={item} className="rounded-2xl px-4 py-3 text-left font-bold text-[#f4e9e3] hover:bg-white/10">{item}</button>
          ))}
        </nav>
      </aside>
      <section className="p-6 md:p-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-rose">Owner Dashboard</p>
            <h1 className="mt-2 font-serif text-5xl">Admin Control Panel</h1>
          </div>
          <a href="/" className="rounded-full bg-ink px-6 py-4 font-bold text-white">Preview Client Site</a>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {cards.map(([label, value]) => (
            <div key={label} className="rounded-[2rem] bg-white p-6 shadow">
              <p className="text-3xl font-extrabold">{value}</p>
              <p className="mt-2 text-[#74635d]">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-[2rem] bg-white p-7 shadow">
            <h2 className="font-serif text-3xl">Website Builder</h2>
            <label className="mt-5 block text-sm font-bold">Homepage Heading</label>
            <textarea className="mt-2 w-full rounded-2xl border border-[#eadbd5] p-4" defaultValue="Luxury Eyelash Extensions in Birmingham" />
            <label className="mt-5 block text-sm font-bold">Moving Banner Text</label>
            <textarea className="mt-2 w-full rounded-2xl border border-[#eadbd5] p-4" defaultValue={"New client appointments available this week\n48-hour free cancellation window"} />
            <button className="mt-6 rounded-full bg-ink px-6 py-4 font-bold text-white">Publish Changes</button>
          </section>

          <section className="rounded-[2rem] bg-white p-7 shadow">
            <h2 className="font-serif text-3xl">Booking Slot Manager</h2>
            <label className="mt-5 block text-sm font-bold">Available Slots</label>
            <textarea className="mt-2 w-full rounded-2xl border border-[#eadbd5] p-4" defaultValue={"09:00\n10:30\n12:00\n13:30\n15:00\n17:30"} />
            <button className="mt-6 rounded-full bg-ink px-6 py-4 font-bold text-white">Save Slots</button>
          </section>

          <section className="rounded-[2rem] bg-white p-7 shadow md:col-span-2">
            <h2 className="font-serif text-3xl">Review Moderation</h2>
            <div className="mt-5 overflow-hidden rounded-2xl border border-[#eadbd5]">
              <table className="w-full text-left text-sm">
                <thead className="bg-cream">
                  <tr><th className="p-4">Client</th><th>Review</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[#eadbd5]"><td className="p-4">Aisha</td><td>Lovely service and beautiful lashes.</td><td>Pending</td><td><button className="font-bold text-rose">Approve</button></td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
