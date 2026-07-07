export default function MovingBanner() {
  const items = [
    "New client appointments available this week",
    "Luxury lash extensions in Birmingham",
    "48-hour free cancellation window",
    "Gift cards coming soon",
    "Secure deposits through the website"
  ];

  return (
    <section className="overflow-hidden bg-ink py-4 text-white">
      <div className="moving-track flex w-max gap-9 font-extrabold">
        {[...items, ...items].map((item, index) => (
          <span key={index} className="whitespace-nowrap before:mr-5 before:text-gold before:content-['•']">{item}</span>
        ))}
      </div>
    </section>
  );
}
