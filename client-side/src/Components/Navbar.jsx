import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes, FaPlus, FaHome, FaCalendarAlt } from 'react-icons/fa';
import { MdEvent } from 'react-icons/md';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const navLinks = [
        { to: "/", label: "Home", icon: <FaHome className="mr-2" /> },
        { to: "/events", label: "Events", icon: <FaCalendarAlt className="mr-2" /> },
        { to: "/add-event", label: "Add Event", icon: <FaPlus className="mr-2" /> },
        { to: "/my-event", label: "My Events", icon: <MdEvent className="mr-2" /> },
    ];

    return (
        <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-gradient-to-r from-teal-500 to-cyan-600'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <span className={`text-2xl font-bold tracking-wide ${scrolled ? 'text-teal-600' : 'text-white'}`}>
                                EventHub
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${location.pathname === link.to
                                        ? scrolled
                                            ? 'bg-teal-100 text-teal-800 font-semibold'
                                            : 'bg-white text-teal-600 font-semibold'
                                        : scrolled
                                            ? 'text-gray-700 hover:text-teal-800 hover:bg-gray-100 font-medium'
                                            : 'text-white hover:text-teal-700 hover:bg-white hover:bg-opacity-30 font-medium'
                                    }`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* User/Auth Section */}
                    <div className="flex items-center">
                        {!user ? (
                            <Link
                                to="/login"
                                className={`hidden md:block px-4 py-2 rounded-full text-sm font-medium transition-all ${scrolled
                                        ? 'bg-teal-600 text-white hover:bg-teal-700 hover:scale-105'
                                        : 'bg-white text-teal-600 hover:bg-gray-100 hover:text-teal-700 hover:scale-105'
                                    }`}
                            >
                                Sign In
                            </Link>
                        ) : (
                            <div className="dropdown dropdown-end">
                                <label
                                    tabIndex={0}
                                    className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform"
                                >
                                    {user.photoURL ? (
                                        <div className={`w-10 rounded-full ring ${scrolled ? 'ring-teal-500' : 'ring-white'} ring-offset-2 hover:ring-2`}>
                                            <img src={user.photoURL} alt="Profile" />
                                        </div>
                                    ) : (
                                        <FaUserCircle className={`text-3xl ${scrolled ? 'text-teal-600 hover:text-teal-700' : 'text-white hover:text-teal-100'}`} />
                                    )}
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-white rounded-box w-52"
                                >
                                    <li className="px-4 py-2 border-b">
                                        <span className="font-semibold text-gray-700">
                                            {user.name || 'Anonymous'}
                                        </span>
                                    </li>
                                    <li>
                                        <button
                                            onClick={logout}
                                            className="text-red-600 hover:bg-red-50 hover:text-red-700 px-4 py-2 font-medium"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`md:hidden ml-4 p-2 rounded-full ${scrolled ? 'text-gray-700 hover:text-teal-700 hover:bg-gray-100' : 'text-white hover:text-teal-100 hover:bg-white hover:bg-opacity-30'}`}
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <FaTimes className="h-6 w-6" />
                            ) : (
                                <FaBars className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className={`md:hidden ${scrolled ? 'bg-white shadow-lg' : 'bg-teal-600'}`}>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center px-3 py-3 rounded-md text-base font-medium mx-2 ${location.pathname === link.to
                                        ? scrolled
                                            ? 'bg-teal-100 text-teal-800 font-semibold'
                                            : 'bg-white text-teal-600 font-semibold'
                                        : scrolled
                                            ? 'text-gray-700 hover:text-teal-800 hover:bg-gray-100'
                                            : 'text-white hover:text-teal-100 hover:bg-white hover:bg-opacity-30'
                                    }`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}

                        {user ? (
                            <div className="pt-4 pb-3 border-t border-gray-200 mx-2">
                                <div className="flex items-center px-3">
                                    {user.photoURL ? (
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-10 w-10 rounded-full hover:scale-105 transition-transform"
                                                src={user.photoURL}
                                                alt="Profile"
                                            />
                                        </div>
                                    ) : (
                                        <FaUserCircle
                                            className={`h-10 w-10 ${scrolled ? 'text-teal-600 hover:text-teal-700' : 'text-white hover:text-teal-100'}`}
                                        />
                                    )}
                                    <div className="ml-3">
                                        <div className={`text-base font-medium ${scrolled ? 'text-gray-800' : 'text-white'}`}>
                                            {user.name || 'Anonymous'}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                        className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${scrolled
                                                ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                                                : 'text-white hover:text-teal-100 hover:bg-white hover:bg-opacity-30'
                                            }`}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="px-3 py-2">
                                <Link
                                    to="/login"
                                    className={`block w-full text-center px-3 py-2 rounded-md text-base font-medium ${scrolled
                                            ? 'bg-teal-600 text-white hover:bg-teal-700 hover:scale-105'
                                            : 'bg-white text-teal-600 hover:bg-gray-100 hover:text-teal-700 hover:scale-105'
                                        }`}
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;