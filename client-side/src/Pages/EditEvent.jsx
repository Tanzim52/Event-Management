import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaAlignLeft, FaUsers, FaImage } from 'react-icons/fa';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        name: '',
        date: '',
        time: '',
        location: '',
        description: '',
        attendeeCount: 0,
        imageURL: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const { user, logout } = useAuth();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events/${id}`, {
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

                if (response.status === 404) {
                    throw new Error('Event not found');
                }

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Failed to fetch event');

                // Convert the event data to form format
                const eventDate = new Date(data.date);
                setFormData({
                    title: data.title,
                    name: data.name,
                    date: eventDate.toISOString().split('T')[0],
                    time: eventDate.toTimeString().substring(0, 5),
                    location: data.location,
                    description: data.description,
                    attendeeCount: data.attendeeCount,
                    imageURL: data.imageURL || ''
                });
            } catch (err) {
                setErrors({ general: err.message });
            } finally {
                setIsFetching(false);
            }
        };

        fetchEvent();
    }, [id, logout]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Event title is required';
        if (!formData.name.trim()) newErrors.name = 'Your name is required';
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.time) newErrors.time = 'Time is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (isNaN(formData.attendeeCount)) newErrors.attendeeCount = 'Must be a number';
        if (formData.imageURL && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formData.imageURL)) {
            newErrors.imageURL = 'Please enter a valid image URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const dateTime = new Date(`${formData.date}T${formData.time}`);

            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    name: formData.name || user.name,
                    date: dateTime.toISOString(),
                    location: formData.location,
                    description: formData.description,
                    attendeeCount: parseInt(formData.attendeeCount),
                    imageURL: formData.imageURL || null
                })
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                logout();
                throw new Error('Session expired. Please login again.');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update event');
            }

            navigate('/my-event');
        } catch (error) {
            setErrors({ general: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
    );

    if (errors.general) return (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mx-auto max-w-md text-center mt-12">
            {errors.general}
            {errors.general.includes('Session expired') && (
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
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-12"
        >
            <div className="max-w-md mx-auto">
                <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="text-center mb-8"
                >
                    <h2 className="text-3xl font-extrabold text-teal-600">Edit Event</h2>
                    <p className="mt-2 text-sm text-teal-500">Update your event details</p>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="bg-white py-8 px-6 shadow-xl rounded-xl"
                >
                    {errors.general && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm"
                        >
                            {errors.general}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title Field */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Event Title
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`block w-full px-3 py-2 border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
                                    placeholder="Amazing Tech Conference"
                                />
                            </div>
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Your Name
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name || user?.name || ''}
                                    onChange={handleChange}
                                    className={`block w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        {/* Date and Time Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                    Date
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaCalendarAlt className="text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-3 py-2 border ${errors.date ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
                                    />
                                </div>
                                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                            </div>

                            <div>
                                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                                    Time
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaCalendarAlt className="text-gray-400" />
                                    </div>
                                    <input
                                        type="time"
                                        id="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-3 py-2 border ${errors.time ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
                                    />
                                </div>
                                {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
                            </div>
                        </div>

                        {/* Location Field */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                Location
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaMapMarkerAlt className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-2 border ${errors.location ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
                                    placeholder="123 Main St, City"
                                />
                            </div>
                            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                                    <FaAlignLeft className="text-gray-400" />
                                </div>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-2 border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
                                    placeholder="Describe your event..."
                                />
                            </div>
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        {/* Attendee Count Field */}
                        <div>
                            <label htmlFor="attendeeCount" className="block text-sm font-medium text-gray-700">
                                Attendees
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUsers className="text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    id="attendeeCount"
                                    name="attendeeCount"
                                    min="0"
                                    value={formData.attendeeCount}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-2 border ${errors.attendeeCount ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
                                    placeholder="0"
                                />
                            </div>
                            {errors.attendeeCount && <p className="mt-1 text-sm text-red-600">{errors.attendeeCount}</p>}
                        </div>

                        {/* Image URL Field */}
                        <div>
                            <label htmlFor="imageURL" className="block text-sm font-medium text-gray-700">
                                Event Image URL (Optional)
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaImage className="text-gray-400" />
                                </div>
                                <input
                                    type="url"
                                    id="imageURL"
                                    name="imageURL"
                                    value={formData.imageURL}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-2 border ${errors.imageURL ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
                                    placeholder="https://example.com/event-image.jpg"
                                />
                            </div>
                            {errors.imageURL && <p className="mt-1 text-sm text-red-600">{errors.imageURL}</p>}
                            {formData.imageURL && !errors.imageURL && (
                                <div className="mt-3">
                                    <p className="text-xs text-gray-500 mb-1">Image Preview:</p>
                                    <img
                                        src={formData.imageURL}
                                        alt="Event preview"
                                        className="w-full h-48 object-cover rounded-lg border-2 border-teal-100"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22320%22%20height%3D%22192%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%2296%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20fill%3D%22%239ca3af%22%3EImage%20not%20available%3C%2Ftext%3E%3C%2Fsvg%3E';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="pt-4"
                        >
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating Event...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Update Event
                                    </span>
                                )}
                            </button>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default EditEvent;