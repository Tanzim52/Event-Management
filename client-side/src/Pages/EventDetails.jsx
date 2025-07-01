import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaArrowLeft,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../Context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.status === 401) {
          // Handle unauthorized access (optional: redirect to login)
          throw new Error('Please login to view event details');
        }

        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || 'Failed to fetch event');
        
        setEvent(data);
        setIsJoined(user && data.attendees?.includes(user._id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user]);

  const handleJoin = async () => {
    if (!user || isJoined || isJoining) return;
    
    setIsJoining(true);
    const toastId = toast.loading('Joining event...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events/${id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to join event');
      }

      const updatedEvent = await response.json();
      setEvent(updatedEvent);
      setIsJoined(true);
      
      toast.update(toastId, {
        render: 'Successfully joined the event!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
    } catch (err) {
      toast.update(toastId, {
        render: err.message || 'Failed to join event',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>
  );

   if (error && error.includes('Please login')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-teal-600 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login', { state: { from: `/events/${id}` } })}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const isPastEvent = new Date() > eventDate;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center text-teal-600 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Events
        </motion.button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          {event.imageURL && (
            <div className="h-64 sm:h-80 md:h-96 w-full overflow-hidden relative">
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                src={event.imageURL}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              {isPastEvent && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                  Past Event
                </div>
              )}
            </div>
          )}

          <div className="p-6 sm:p-8">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-teal-600 mb-2"
            >
              {event.title}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 mb-6"
            >
              {event.description}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            >
              <div className="bg-teal-50 rounded-lg p-4">
                <div className="flex items-center text-teal-600 mb-2">
                  <FaCalendarAlt className="mr-2" />
                  <h3 className="font-semibold">Date & Time</h3>
                </div>
                <p className="text-gray-700">
                  {formattedDate} at {formattedTime}
                </p>
              </div>

              <div className="bg-teal-50 rounded-lg p-4">
                <div className="flex items-center text-teal-600 mb-2">
                  <FaMapMarkerAlt className="mr-2" />
                  <h3 className="font-semibold">Location</h3>
                </div>
                <p className="text-gray-700">{event.location}</p>
              </div>

              <div className="bg-teal-50 rounded-lg p-4">
                <div className="flex items-center text-teal-600 mb-2">
                  <FaUsers className="mr-2" />
                  <h3 className="font-semibold">Attendees</h3>
                </div>
                <p className="text-gray-700">
                  {event.attendeeCount} {event.attendeeCount === 1 ? 'person' : 'people'} attending
                </p>
              </div>

              <div className="bg-teal-50 rounded-lg p-4">
                <div className="flex items-center text-teal-600 mb-2">
                  <FaUsers className="mr-2" />
                  <h3 className="font-semibold">Organizer</h3>
                </div>
                <p className="text-gray-700">{event.name}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center"
            >
              <button
                onClick={handleJoin}
                disabled={!user || isJoined || isPastEvent || isJoining}
                className={`px-8 py-3 rounded-full font-medium text-lg flex items-center justify-center transition-all duration-200 ${
                  isPastEvent
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isJoined
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : isJoining
                    ? 'bg-teal-500 text-white cursor-wait'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg hover:shadow-teal-200'
                }`}
              >
                {isJoining ? (
                  <div className="flex items-center">
                    <FiClock className="animate-spin mr-2" />
                    Joining...
                  </div>
                ) : isJoined ? (
                  <>
                    <FaCheck className="mr-2" />
                    You're Attending
                  </>
                ) : isPastEvent ? (
                  'Event Has Ended'
                ) : user ? (
                  'Join This Event'
                ) : (
                  'Login to Join'
                )}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EventDetails;