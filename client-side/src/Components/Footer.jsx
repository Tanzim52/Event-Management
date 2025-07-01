import { FaFacebookF, FaLinkedinIn, FaGithub, FaArrowRight, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-800 text-white pt-20 pb-10 px-6">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-purple-600 blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-indigo-600 blur-[100px]"></div>
      </div>

      {/* Floating circles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, 20, 0],
              x: [0, i % 2 === 0 ? 15 : -15, 0]
            }}
            transition={{
              duration: 10 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute rounded-full opacity-10 ${i % 2 === 0 ? 'bg-white' : 'bg-teal-300'}`}
            style={{
              width: `${10 + (i * 5)}px`,
              height: `${10 + (i * 5)}px`,
              bottom: `${5 + (i * 10)}%`,
              left: `${5 + (i * 12)}%`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:pr-24">
          {/* Brand Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <h2 className="text-3xl font-bold mb-4 flex items-center">
              <span className="bg-gradient-to-r from-teal-400 to-teal-600 text-transparent bg-clip-text">
                EventHub
              </span>
            </h2>
            <p className="text-indigo-100 mb-6 max-w-md">
              The ultimate platform for hosting, discovering, and managing events with cutting-edge technology.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/share/1LFXH6LPxh/" target="blank" className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                <FaFacebookF className="text-lg" />
              </a>
              <a href="https://www.linkedin.com/in/tanzim52/" target='blank' className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                <FaLinkedinIn className="text-lg" />
              </a>
              <a href="https://www.instagram.com/tanzim_52?igsh=ejZsZ3lma2twaXlj" target='blank' className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                <FaInstagram className="text-lg" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 text-teal-300">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Events', 'Add Event', 'My Event', 'Sign In'].map((item, i) => (
                <li key={i}>
                  <a 
                    href={`/${item.toLowerCase().replace(' ', '-')}`} 
                    className="flex items-center gap-2 text-indigo-100 hover:text-teal-300 transition-colors"
                  >
                    <FaArrowRight className="text-xs opacity-70" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 text-teal-300">Contact Us</h3>
            <ul className="space-y-3 text-indigo-100">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>support@eventmanager.com</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>123 Event St, San Francisco, CA</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 pt-6 border-t border-white/10 text-center text-sm text-indigo-200"
        >
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <span>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</span>
            <span className="hidden md:block">•</span>
            <div className="flex gap-4">
              <a href="https://en.wikipedia.org/wiki/Privacy_policy" target='blank' className="hover:text-teal-300 transition-colors">Privacy Policy</a>
              <a href="https://en.wikipedia.org/wiki/Terms_of_service" target='blank' className="hover:text-teal-300 transition-colors">Terms of Service</a>
              <a href="https://en.wikipedia.org/wiki/HTTP_cookie" target='blank' className="hover:text-teal-300 transition-colors">Cookies</a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;