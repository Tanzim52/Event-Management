import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyEvents = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        eventId: null,
        eventTitle: ''
    });
    const { user, logout } = useAuth();

    useEffect(() => {

        if (location.state?.success) {
            toast.success('Event updated successfully!');
            navigate(location.pathname, { replace: true, state: {} });
        }
        const fetchMyEvents = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found. Please login.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events/my-events`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (response.status === 401) {
                    localStorage.removeItem('token');
                    logout();
                    throw new Error('Session expired. Please login again.');
                }

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Failed to fetch events');

                setEvents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyEvents();
    }, [user, logout, location.state, navigate, location.pathname]);

    const openDeleteModal = (eventId, eventTitle) => {
        setDeleteModal({
            isOpen: true,
            eventId,
            eventTitle
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            eventId: null,
            eventTitle: ''
        });
    };

    const handleDelete = async () => {
        if (!deleteModal.eventId) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events/${deleteModal.eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                logout();
                throw new Error('Session expired. Please login again.');
            }

            if (!response.ok) throw new Error('Failed to delete event');

            setEvents(events.filter(event => event._id !== deleteModal.eventId));
            toast.success('Event deleted successfully!');
            closeDeleteModal();
        } catch (err) {
            setError(err.message);
            closeDeleteModal();
        }
    };

    const handleEditClick = (eventId) => {
        navigate(`/edit-event/${eventId}`, {
            state: { from: location.pathname } 
        });
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mx-auto max-w-md text-center">
            {error}
            {error.includes('Session expired') && (
                <button
                    onClick={() => navigate('/login')}
                    className="mt-2 bg-teal-600 hover:bg-teal-700 text-white py-1 px-4 rounded-lg text-sm"
                >
                    Login Again
                </button>
            )}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 py-8 mt-12"
        >
            <h1 className="text-3xl font-bold text-teal-600 mb-8">My Events</h1>

            {events.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">You haven't created any events yet</p>
                    <button
                        className="mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg"
                        onClick={() => navigate('/add-event')}
                    >
                        Create Your First Event
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => (
                        <motion.div
                            key={event._id}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                        >
                            {event.imageURL && (
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={event.imageURL}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-teal-600">{event.title}</h3>
                                <div className="mt-4 space-y-2 text-gray-600">
                                    <p className="flex items-center">
                                        <FaCalendarAlt className="mr-2 text-teal-500" />
                                        {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                                    </p>
                                    <p className="flex items-center">
                                        <FaMapMarkerAlt className="mr-2 text-teal-500" />
                                        {event.location}
                                    </p>
                                    <p className="flex items-center">
                                        <FaUsers className="mr-2 text-teal-500" />
                                        {event.attendeeCount} attendees
                                    </p>
                                </div>
                                <p className="mt-4 text-gray-700">{event.description}</p>

                                <div className="mt-6 flex space-x-3">
                                    <button
                                        className="flex-1 bg-teal-100 hover:bg-teal-200 text-teal-700 py-2 px-4 rounded-lg flex items-center justify-center"
                                        onClick={() => handleEditClick(event._id)}
                                    >
                                        <FaEdit className="mr-2" /> Edit
                                    </button>
                                    <button
                                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg flex items-center justify-center"
                                        onClick={() => openDeleteModal(event._id, event.title)}
                                    >
                                        <FaTrash className="mr-2" /> Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModal.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-xl shadow-xl max-w-md w-full"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
                                    <button 
                                        onClick={closeDeleteModal}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                                
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete the event <span className="font-semibold">"{deleteModal.eventTitle}"</span>? This action cannot be undone.
                                </p>
                                
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={closeDeleteModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                                    >
                                        Delete Event
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MyEvents;