import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaSearch, FaFilter, FaPlus } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import EventCard from '../Components/EventsPageElements/EventCard';
import FilterModal from '../Components/EventsPageElements/FilterModal';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({
        today: false,
        currentWeek: false,
        lastWeek: false,
        currentMonth: false,
        lastMonth: false,
        customRange: { start: null, end: null }
    });
    const { user } = useAuth();

    // Fetch all events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Failed to fetch events');

                // Sort events by date (newest first)
                const sortedEvents = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setEvents(sortedEvents);
                setFilteredEvents(sortedEvents);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Apply search and filters
    useEffect(() => {
        let results = [...events];

        // Apply search
        if (searchTerm) {
            results = results.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply date filters
        const now = new Date();
        const todayStart = new Date(now.setHours(0, 0, 0, 0));
        const todayEnd = new Date(now.setHours(23, 59, 59, 999));

        if (filters.today) {
            results = results.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= todayStart && eventDate <= todayEnd;
            });
        }

        if (filters.currentWeek) {
            const weekStart = new Date(todayStart);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            results = results.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= weekStart && eventDate <= weekEnd;
            });
        }

        if (filters.lastWeek) {
            const lastWeekStart = new Date(todayStart);
            lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay() - 7);
            const lastWeekEnd = new Date(lastWeekStart);
            lastWeekEnd.setDate(lastWeekStart.getDate() + 6);

            results = results.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= lastWeekStart && eventDate <= lastWeekEnd;
            });
        }

        if (filters.currentMonth) {
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            results = results.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= monthStart && eventDate <= monthEnd;
            });
        }

        if (filters.lastMonth) {
            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

            results = results.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= lastMonthStart && eventDate <= lastMonthEnd;
            });
        }

        if (filters.customRange.start && filters.customRange.end) {
            results = results.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= new Date(filters.customRange.start) &&
                    eventDate <= new Date(filters.customRange.end);
            });
        }

        setFilteredEvents(results);
    }, [searchTerm, filters, events]);

    const handleJoinEvent = async (eventId) => {
        if (!user) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events/${eventId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to join event');
            }

            const updatedEvent = await response.json();

            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event._id === eventId ? updatedEvent : event
                )
            );

            return true; // Return success status
        } catch (err) {
            console.error("Join error:", err);
            setError(err.message);
            return false; // Return failure status
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mx-auto max-w-md text-center">
            {error}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 mt-12">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-teal-600 mb-2">Discover Events</h1>
                    <p className="text-gray-600">Find and join exciting events happening around you</p>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <motion.div
                        className="relative flex-grow"
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </motion.div>

                    <motion.button
                        onClick={() => setShowFilterModal(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                        <FaFilter className="text-teal-600" />
                        <span>Filters</span>
                    </motion.button>
                </div>

                {filteredEvents.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-xl shadow-md p-8 text-center"
                    >
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No events found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredEvents.map((event) => (
                                <EventCard
                                    key={event._id}
                                    event={event}
                                    onJoin={handleJoinEvent}
                                    isJoined={user && event.attendees?.includes(user._id)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                <FilterModal
                    isOpen={showFilterModal}
                    onClose={() => setShowFilterModal(false)}
                    filters={filters}
                    setFilters={setFilters}
                />
            </div>
        </div>
    );
};

export default Events;