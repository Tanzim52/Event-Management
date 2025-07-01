import React, { useState, useEffect } from 'react';

const Banner = () => {
    const carouselItems = [
        {
            id: 1,
            title: "Plan. Share. Attend.",
            description: "Simplify your event journey with EventManager. Host and join events effortlessly.",
            image: "https://i.ibb.co/WqkDhPY/10058.jpg",
            showButtons: true
        },
        {
            id: 2,
            title: "Discover Amazing Events",
            description: "Find local events that match your interests and passions.",
            image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            showButtons: false
        },
        {
            id: 3,
            title: "Host With Confidence",
            description: "Our tools make event planning simple and stress-free.",
            image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            showButtons: false
        },
        {
            id: 4,
            title: "Connect With Community",
            description: "Meet like-minded people at events near you.",
            image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            showButtons: false
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        let interval;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isAutoPlaying, carouselItems.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
    };

    return (
        <section className="relative h-[80vh] max-h-[800px] min-h-[500px] w-full overflow-hidden">
            {/* Carousel items */}
            <div
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {carouselItems.map((item) => (
                    <div
                        key={item.id}
                        className="w-full flex-shrink-0 relative h-full"
                    >
                        {/* Background image with overlay */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${item.image})` }}
                        >
                            <div className="absolute inset-0 bg-black/35 bg-opacity-60"></div>
                        </div>

                        {/* Content */}
                        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                                {item.title}
                            </h1>
                            <p className="text-white text-lg md:text-xl max-w-xl mx-auto mb-8 opacity-90">
                                {item.description}
                            </p>

                            {/* Conditionally render buttons only for first slide */}
                            {item.showButtons && (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a
                                        href="/events"
                                        className="bg-secondary hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        View Events
                                    </a>
                                    <a
                                        href="/add-event"
                                        className="bg-transparent border-2 border-white hover:bg-orange-600 hover:bg-opacity-20 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                                    >
                                        Add Event
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {carouselItems.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white w-6' : 'bg-white bg-opacity-50'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Banner;