import { FaFacebookF, FaLinkedinIn, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#2CA58D] text-white py-10 px-4 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Section 1: Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-2">EventManager</h2>
          <p className="text-sm text-white/80">
            Host, join, and manage events with ease. Built with MERN and designed for simplicity and performance.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-white/90 text-sm">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/events" className="hover:underline">Events</a></li>
            <li><a href="/add-event" className="hover:underline">Add Event</a></li>
            <li><a href="/my-event" className="hover:underline">My Event</a></li>
            <li><a href="/login" className="hover:underline">Sign In</a></li>
          </ul>
        </div>

        {/* Section 3: Social + Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect With Us</h3>
          <div className="flex items-center gap-4 text-white/90">
            <a href="#" className="hover:text-secondary"><FaFacebookF /></a>
            <a href="#" className="hover:text-secondary"><FaLinkedinIn /></a>
            <a href="#" className="hover:text-secondary"><FaGithub /></a>
          </div>
          <p className="text-sm text-white/70 mt-4">Email: support@eventmanager.dev</p>
        </div>

      </div>

      <div className="mt-10 text-center text-sm text-white/60 border-t border-white/20 pt-6">
        &copy; {new Date().getFullYear()} EventManager. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
