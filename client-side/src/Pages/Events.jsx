import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaSearch, 
  FaFilter, 
  FaChevronLeft, 
  FaChevronRight,
  FaEllipsisH
} from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import EventCard from '../Components/EventsPageElements/EventCard';
import FilterModal from '../Components/EventsPageElements/FilterModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 6;

    // Calculate pagination
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

    // Fetch all events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Failed to fetch events');

                // Get joined events from user's data if logged in
                let joinedEvents = [];
                if (user) {
                    const userResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        joinedEvents = userData.user.joinedEvents || [];
                    }
                }

                // Sort events by date (newest first) and mark joined events
                const sortedEvents = data.map(event => ({
                    ...event,
                    isJoined: joinedEvents.includes(event._id)
                })).sort((a, b) => new Date(b.date) - new Date(a.date));
                
                setEvents(sortedEvents);
                setFilteredEvents(sortedEvents);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user]);

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
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchTerm, filters, events]);

    const handleJoinEvent = async (eventId) => {
        if (!user) {
            return false;
        }

        try {
            // Optimistic update
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event._id === eventId 
                        ? { ...event, attendees: [...event.attendees, user._id], isJoined: true }
                        : event
                )
            );
            
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events/${eventId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                // Revert optimistic update if API call fails
                setEvents(prevEvents =>
                    prevEvents.map(event =>
                        event._id === eventId 
                            ? { 
                                ...event, 
                                attendees: event.attendees.filter(id => id !== user._id),
                                isJoined: false 
                              }
                            : event
                    )
                );
                
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to join event');
            }

            const updatedEvent = await response.json();

            // Update events with the server response
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event._id === eventId ? { ...updatedEvent, isJoined: true } : event
                )
            );

            // Show success toast
            

            return true;
        } catch (err) {
            // console.error("Join error:", err);
            setError(err.message);
            
            // Show error toast
            
            
            return false;
        }
    };


    // Pagination functions
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    // Generate visible page numbers (responsive)
    const getVisiblePages = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        if (currentPage <= 3) {
            start = 2;
            end = 4;
        } else if (currentPage >= totalPages - 2) {
            start = totalPages - 3;
            end = totalPages - 1;
        }

        return [1, ...(start > 2 ? ['ellipsis'] : []), ...Array.from({ length: end - start + 1 }, (_, i) => start + i), ...(end < totalPages - 1 ? ['ellipsis'] : []), totalPages];
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

                <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-8">
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
                        <span className="hidden sm:inline">Filters</span>
                    </motion.button>
                </div>

                {currentEvents.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-xl shadow-md p-8 text-center"
                    >
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No events found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </motion.div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {currentEvents.map((event) => (
                                    <EventCard
                                        key={event._id}
                                        event={event}
                                        onJoin={handleJoinEvent}
                                        isJoined={event.isJoined}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Responsive Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-8 space-x-1 sm:space-x-2">
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    className={`p-2 sm:p-3 rounded-full ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-teal-600 hover:bg-gray-100'}`}
                                    aria-label="Previous page"
                                >
                                    <FaChevronLeft />
                                </button>

                                {getVisiblePages().map((page, index) => (
                                    page === 'ellipsis' ? (
                                        <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">
                                            <FaEllipsisH />
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() => paginate(page)}
                                            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full ${currentPage === page ? 'bg-teal-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            {page}
                                        </button>
                                    )
                                ))}

                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 sm:p-3 rounded-full ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-teal-600 hover:bg-gray-100'}`}
                                    aria-label="Next page"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </>
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