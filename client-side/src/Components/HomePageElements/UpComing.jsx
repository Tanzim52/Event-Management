import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUser, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const cardVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", bounce: 0.4, duration: 0.8 }
    }
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Upcoming = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUpcomingEvents = async () => {
            try {
                console.log("Fetching upcoming events...");
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events/upcoming`);

                console.log("Response status:", response.status);
                const data = await response.json();
                console.log("Response data:", data);

                if (!response.ok) throw new Error(data.message || 'Failed to fetch events');

                setEvents(data);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingEvents();
    }, []);

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return isNaN(date.getTime())
                ? 'Date not set'
                : date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
        } catch (e) {
            console.error("Date formatting error:", e);
            return 'Invalid date';
        }
    };

    const formatTime = (dateString) => {
        try {
            const date = new Date(dateString);
            return isNaN(date.getTime())
                ? ''
                : date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
        } catch (e) {
            console.error("Time formatting error:", e);
            return '';
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            <span className="ml-4">Loading upcoming events...</span>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mx-auto max-w-md text-center">
            Error loading events: {error}
        </div>
    );

    return (
        <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-teal-600 mb-4">Upcoming Events</h2>
                    <p className="text-xl text-gray-600">Discover what's happening soon</p>
                </motion.div>

                {events.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500 text-lg">No upcoming events found in the database</p>
                        <p className="text-sm text-gray-400 mt-2">
                            Check your database and ensure events have future dates
                        </p>
                        {/* View All Events button for empty state */}
                        <div className="mt-6">
                            <motion.div
                                variants={fadeIn}
                                className="mt-16 text-center"
                            >
                                <Link to='/events' className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2">
                                    View All Events
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map((event, index) => (
                                <motion.div
                                    key={event._id || index}
                                    variants={cardVariants}
                                    initial="offscreen"
                                    whileInView="onscreen"
                                    className="bg-white rounded-xl shadow-md overflow-hidden"
                                >
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={event.imageURL || '/default-event.jpg'}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                        <div className="flex items-center text-gray-600 mb-1">
                                            <FaUser className="mr-2" />
                                            <span>Posted by {event.name}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 mb-1">
                                            <FaCalendarAlt className="mr-2" />
                                            <span>{formatDate(event.date)}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 mb-1">
                                            <FaClock className="mr-2" />
                                            <span>{formatTime(event.date)}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 mb-4">
                                            <FaMapMarkerAlt className="mr-2" />
                                            <span>{event.location}</span>
                                        </div>
                                        <p className="text-gray-700 mb-4 line-clamp-2">{event.description}</p>
                                        <div className="flex items-center text-teal-600">
                                            <FaUsers className="mr-2" />
                                            <span>{event.attendeeCount || 0} attending</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* View All Events button at the bottom */}
                        <motion.div
                            variants={fadeIn}
                            className="mt-16 text-center"
                        >
                            <Link to='/events' className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2">
                                View All Events
                            </Link>
                        </motion.div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Upcoming;