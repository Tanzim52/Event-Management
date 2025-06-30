const steps = [
  { title: "Create Event", icon: "📝", desc: "Fill in the event details easily" },
  { title: "Share", icon: "🔗", desc: "Let others know with one click" },
  { title: "Join", icon: "🎉", desc: "View, join, and attend seamlessly" }
];

const HowItWorks = () => {
  return (
    <section className="bg-white py-16 px-4">
      <h2 className="text-3xl font-bold text-center text-primary mb-10">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {steps.map((step, i) => (
          <div key={i} className="bg-background p-6 rounded-xl shadow text-center">
            <div className="text-5xl mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold text-textPrimary mb-2">{step.title}</h3>
            <p className="text-textMuted">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
