import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

const CallToAction = () => {
  const { user } = useContext(AuthContext);

  return (
    <section className="bg-primary text-white text-center py-20 px-4">
      <h2 className="text-3xl font-bold mb-4">
        {user ? "Ready to host your next big event?" : "Start your event journey now!"}
      </h2>
      <p className="text-lg mb-6">
        {user ? "Click below to add your event and invite attendees." : "Sign in to create and manage your events easily."}
      </p>
      <a
        href={user ? "/add-event" : "/login"}
        className="bg-secondary text-white px-6 py-3 rounded hover:bg-orange-500 transition"
      >
        {user ? "Add Event" : "Sign In"}
      </a>
    </section>
  );
};

export default CallToAction;
