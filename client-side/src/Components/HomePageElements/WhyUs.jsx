import React from 'react';
import { motion } from 'framer-motion';

const benefits = [
  { 
    title: "Intuitive Interface",
    description: "Our clean, professional UI makes event management effortless for everyone",
    icon: "✨",
    color: "from-teal-100 to-teal-50",
    border: "border-teal-200"
  },
  { 
    title: "Smart Filtering",
    description: "Find exactly what you need with powerful week/month/year filters",
    icon: "📆",
    color: "from-blue-100 to-blue-50",
    border: "border-blue-200"
  },
  { 
    title: "Lightning Fast",
    description: "Experience instant loading and seamless navigation throughout",
    icon: "🚀",
    color: "from-purple-100 to-purple-50",
    border: "border-purple-200"
  },
  { 
    title: "Bank-Grade Security",
    description: "Your data stays protected with enterprise-level encryption",
    icon: "🔐",
    color: "from-amber-100 to-amber-50",
    border: "border-amber-200"
  },
  { 
    title: "One-Click Actions",
    description: "Join or host events with a single tap - no complicated processes",
    icon: "✅",
    color: "from-rose-100 to-rose-50",
    border: "border-rose-200"
  },
  { 
    title: "Real-Time Updates",
    description: "Get instant notifications about event changes and messages",
    icon: "🔔",
    color: "from-indigo-100 to-indigo-50",
    border: "border-indigo-200"
  }
];

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};

const WhyUs = () => {
  return (
    <section className="relative bg-white py-20 px-4 overflow-hidden">
      {/* Decorative teal elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-80 h-80 rounded-full bg-teal-100 blur-[100px] opacity-20"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-teal-50 blur-[100px] opacity-20"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-teal-600 mb-4">
            Why EventManager Excels
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Designed for both event organizers and attendees who demand excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-gradient-to-br ${benefit.color} rounded-xl p-6 border ${benefit.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl p-3 bg-white rounded-lg shadow-xs">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600 mb-6">
            Trusted by thousands of event professionals worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">5M+ Events</div>
            <div className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">98% Satisfaction</div>
            <div className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">24/7 Support</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUs;