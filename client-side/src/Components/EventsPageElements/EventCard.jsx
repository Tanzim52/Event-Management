import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCheck, FaInfoCircle } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventCard = ({ event, onJoin, isJoined }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (isJoined || isLoading) return;
    
    setIsLoading(true);
    const toastId = toast.loading('Joining event...');
    
    try {
      const success = await onJoin(event._id);
      if (success) {
        toast.update(toastId, {
          render: "Successfully joined the event!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render: error.message || "Failed to join event",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailsClick = () => {
    navigate(`/events/${event._id}`);
  };

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const isPastEvent = new Date() > eventDate;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col h-full"
    >
      {event.imageURL && (
        <div className="h-48 sm:h-56 md:h-48 lg:h-56 w-full overflow-hidden relative">
          <img
            src={event.imageURL}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {isPastEvent && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
              Past Event
            </div>
          )}
        </div>
      )}

      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-2">{event.title}</h3>
          
          <div className="flex items-center mt-3 text-gray-600">
            <FaCalendarAlt className="mr-2 text-teal-500 flex-shrink-0" />
            <span className="text-sm sm:text-base">
              {formattedDate} • {formattedTime}
            </span>
          </div>
          
          <div className="flex items-center mt-2 text-gray-600">
            <FaMapMarkerAlt className="mr-2 text-teal-500 flex-shrink-0" />
            <span className="text-sm sm:text-base line-clamp-1">{event.location}</span>
          </div>
          
          <div className="flex items-center mt-2 text-gray-600">
            <FaUsers className="mr-2 text-teal-500 flex-shrink-0" />
            <span className="text-sm sm:text-base">
              {event.attendeeCount} {event.attendeeCount === 1 ? 'attendee' : 'attendees'}
            </span>
          </div>
          
          <p className="mt-4 text-gray-600 text-sm sm:text-base line-clamp-3">
            {event.description}
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <motion.button
            onClick={handleJoin}
            disabled={isJoined || isLoading || isPastEvent}
            whileHover={(!isJoined && !isLoading && !isPastEvent) ? { scale: 1.02 } : {}}
            whileTap={(!isJoined && !isLoading && !isPastEvent) ? { scale: 0.98 } : {}}
            className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center transition-all duration-200 ${
              isPastEvent
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : isJoined
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : isLoading
                ? 'bg-teal-500 text-white cursor-wait'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <FiClock className="animate-spin mr-2" />
                Processing...
              </div>
            ) : isJoined ? (
              <>
                <FaCheck className="mr-2" />
                Joined
              </>
            ) : isPastEvent ? (
              'Event Ended'
            ) : (
              'Join Event'
            )}
          </motion.button>

          <motion.button
            onClick={handleDetailsClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200"
          >
            <FaInfoCircle className="mr-2 text-teal-500" />
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;