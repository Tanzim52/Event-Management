const events = [
  {
    title: "Tech Meetup 2025",
    date: "June 30, 2025",
    location: "Dhaka, BD"
  },
  {
    title: "Startup Pitch Day",
    date: "July 2, 2025",
    location: "Chittagong"
  },
  {
    title: "React Bangladesh Conference",
    date: "July 10, 2025",
    location: "Sylhet"
  }
];

const Upcoming = () => {
  return (
    <section className="bg-white py-16 px-4">
      <h2 className="text-3xl font-bold text-center text-primary mb-8">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {events.map((event, i) => (
          <div key={i} className="bg-background rounded-lg shadow p-5">
            <h3 className="text-xl font-semibold text-primary">{event.title}</h3>
            <p className="text-textMuted mt-2">{event.date}</p>
            <p className="text-textMuted">{event.location}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Upcoming;
