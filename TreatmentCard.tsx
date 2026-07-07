type Props = {
  name: string;
  price: string;
  duration: string;
  description: string;
};

export default function TreatmentCard({ name, price, duration, description }: Props) {
  return (
    <article className="rounded-[2rem] bg-white p-7 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
      <h3 className="font-serif text-3xl">{name}</h3>
      <p className="mt-3 text-xl font-extrabold text-rose">{price}</p>
      <p className="mt-1 text-sm font-bold text-[#8b746c]">{duration}</p>
      <p className="mt-4 leading-7 text-[#74635d]">{description}</p>
      <a href="/book" className="mt-6 inline-flex w-full justify-center rounded-full bg-white px-5 py-3 font-bold text-ink shadow">Book Now</a>
    </article>
  );
}
