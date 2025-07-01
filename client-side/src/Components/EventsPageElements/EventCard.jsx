import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCheck } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';

const EventCard = ({ event, onJoin, isJoined: initiallyJoined }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(initiallyJoined);

  const handleJoin = async () => {
    if (isJoined || isLoading) return;
    
    setIsLoading(true);
    try {
      const success = await onJoin(event._id);
      if (success) {
        setIsJoined(true);
      }
    } catch (error) {
      console.error("Join error:", error);
    } finally {
      setIsLoading(false);
    }
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

  // Calculate if event is in the past
  const isPastEvent = new Date() > eventDate;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col h-full"
    >
      {/* Event Image */}
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

      {/* Event Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-2">{event.title}</h3>
          
          {/* Date and Time */}
          <div className="flex items-center mt-3 text-gray-600">
            <FaCalendarAlt className="mr-2 text-teal-500 flex-shrink-0" />
            <span className="text-sm sm:text-base">
              {formattedDate} • {formattedTime}
            </span>
          </div>
          
          {/* Location */}
          <div className="flex items-center mt-2 text-gray-600">
            <FaMapMarkerAlt className="mr-2 text-teal-500 flex-shrink-0" />
            <span className="text-sm sm:text-base line-clamp-1">{event.location}</span>
          </div>
          
          {/* Attendees */}
          <div className="flex items-center mt-2 text-gray-600">
            <FaUsers className="mr-2 text-teal-500 flex-shrink-0" />
            <span className="text-sm sm:text-base">
              {event.attendeeCount} {event.attendeeCount === 1 ? 'attendee' : 'attendees'}
            </span>
          </div>
          
          {/* Description */}
          <p className="mt-4 text-gray-600 text-sm sm:text-base line-clamp-3">
            {event.description}
          </p>
        </div>

        {/* Join Button */}
        <motion.button
          onClick={handleJoin}
          disabled={isJoined || isLoading || isPastEvent}
          whileHover={(!isJoined && !isLoading && !isPastEvent) ? { scale: 1.02 } : {}}
          whileTap={(!isJoined && !isLoading && !isPastEvent) ? { scale: 0.98 } : {}}
          className={`w-full mt-5 py-2 px-4 rounded-lg font-medium flex items-center justify-center transition-all duration-200 ${
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
      </div>
    </motion.div>
  );
};

export default EventCard;