import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaRocket, FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Error = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl p-10 rounded-2xl max-w-md w-full relative overflow-hidden"
      >
        {/* Floating background elements */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
          className="absolute -top-8 -left-8 text-blue-200 text-7xl opacity-30"
        >
          <FaExclamationTriangle />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 10, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute -bottom-8 -right-8 text-blue-200 text-7xl opacity-30"
        >
          <FaExclamationTriangle />
        </motion.div>

        {/* Main content */}
        <div className="relative z-10">
          <motion.div
            animate={isAnimating ? {
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0]
            } : {}}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-6"
          >
            <FaExclamationTriangle className="text-red-500 text-6xl" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-gray-800 mb-2"
          >
            404
          </motion.h1>
          
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl text-gray-700 font-semibold mb-2"
          >
            Oops! Page Not Found
          </motion.p>
          
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 mb-8"
          >
            The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to="/" 
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <FaHome /> Go Home
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <FaRocket /> Report Issue
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Floating astronaut animation */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          rotate: [0, 360, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 left-1/4 text-4xl"
      >
        🚀
      </motion.div>
      
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          rotate: [0, -360, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
          delay: 5
        }}
        className="absolute bottom-1/4 right-1/4 text-4xl"
      >
        👨‍🚀
      </motion.div>
    </div>
  );
};

export default Error;