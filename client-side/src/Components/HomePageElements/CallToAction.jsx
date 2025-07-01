import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { motion } from 'framer-motion';

const CallToAction = () => {
  const { user } = useContext(AuthContext);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-800 text-white py-24 px-6">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-purple-600 blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-indigo-600 blur-[100px]"></div>
      </div>
      
      {/* Floating circles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, 20, 0],
              x: [0, i % 2 === 0 ? 15 : -15, 0]
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute rounded-full opacity-10 ${i % 2 === 0 ? 'bg-white' : 'bg-teal-300'}`}
            style={{
              width: `${10 + (i * 5)}px`,
              height: `${10 + (i * 5)}px`,
              top: `${10 + (i * 10)}%`,
              left: `${5 + (i * 12)}%`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
        >
          {user ? (
            <>
              Ready to host your <span className="text-teal-300">next big event</span>?
            </>
          ) : (
            <>
              Start your <span className="text-teal-300">event journey</span> now!
            </>
          )}
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl text-indigo-100 mb-10 max-w-2xl mx-auto"
        >
          {user ? (
            "Click below to add your event and invite attendees in just minutes."
          ) : (
            "Join thousands of event organizers already using our platform."
          )}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <a
            href={user ? "/add-event" : "/login"}
            className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 hover:bg-teal-300 text-indigo-900 font-bold rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {user ? "Add Your Event" : "Get Started Free"}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </motion.div>

        {!user && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-8 text-indigo-200 text-sm"
          >
            No credit card required • Free forever plan available
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default CallToAction;