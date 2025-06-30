import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { title: "Create Event", icon: "📝", desc: "Fill in the event details with our intuitive form" },
  { title: "Share", icon: "🔗", desc: "Spread the word instantly with shareable links" },
  { title: "Join", icon: "🎉", desc: "Discover and attend events with seamless integration" }
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const HowItWorks = () => {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
        className="max-w-7xl mx-auto"
      >
        <motion.h2 
          variants={fadeIn}
          className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16"
        >
          How It <span className="text-teal-600">Works</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-white rounded-2xl shadow-lg transform group-hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100" />
              
              <div className="relative bg-white p-8 rounded-xl shadow-md h-full flex flex-col items-center text-center border border-gray-100 group-hover:border-teal-100 transition-all duration-300">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                
                <div className="w-16 h-1.5 bg-teal-400 rounded-full mb-6" />
                
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {step.desc}
                </p>
                
                <div className="mt-6 text-sm font-medium text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Step {i + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          variants={fadeIn}
          className="mt-16 text-center"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2">
            Get Started
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;