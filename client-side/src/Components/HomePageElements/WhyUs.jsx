const benefits = [
  "✨ Clean and professional UI",
  "📆 Smart event filtering (week, month)",
  "🚀 Fast and responsive experience",
  "🔐 Custom secure authentication",
  "✅ One-click event join & host"
];

const WhyUs = () => {
  return (
    <section className="bg-background py-16 px-4">
      <h2 className="text-3xl font-bold text-center text-primary mb-8">Why Choose EventManager?</h2>
      <ul className="max-w-3xl mx-auto space-y-3 text-lg text-textPrimary">
        {benefits.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-accent text-xl">✔️</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WhyUs;
