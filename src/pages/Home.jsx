import React, { useState } from 'react';
import EventCard from '../components/EventCard.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faTimes,
    faMapMarkerAlt,
    faPhone,
    faEnvelope,
    faPaperPlane,
    faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import {
    faFacebook,
    faInstagram,
    faTwitter,
    faYoutube
} from '@fortawesome/free-brands-svg-icons';

// Main Homepage Component
const GlamourHomepage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const upcomingEvents = [
        {
            title: "Gala Night",
            description: "An exquisite evening of fine dining and entertainment in our grand ballroom.",
            date: "December 15, 2025",
            location: "Grand Ballroom",
            image: "/api/placeholder/400/300" // Replace with: Elegant ballroom setup with chandeliers and round tables
        },
        {
            title: "Wedding Showcase",
            description: "Explore the latest wedding trends and meet top vendors in our beautiful gardens.",
            date: "January 20, 2026",
            location: "Garden Pavilion",
            image: "/api/placeholder/400/300" // Replace with: Wedding ceremony setup with floral arch
        },
        {
            title: "Cocktail Party",
            description: "Join us for a sophisticated night of cocktails, networking, and live entertainment.",
            date: "February 14, 2026",
            location: "Rooftop Lounge",
            image: "/api/placeholder/400/300" // Replace with: Cocktail party setup with bar and ambient lighting
        }
    ];

    const pastEvents = [
        {
            title: "Corporate Gala",
            description: "A successful corporate networking event with premium dining and entertainment.",
            rating: "4.3",
            image: "/api/placeholder/400/300" // Replace with: Corporate event with formal dining setup
        },
        {
            title: "Music Concert",
            description: "An unforgettable musical experience featuring local and international artists.",
            rating: "4.7",
            image: "/api/placeholder/400/300" // Replace with: Concert stage with lights and crowd silhouettes
        },
        {
            title: "Wine Tasting",
            description: "An elegant evening of fine wines paired with gourmet cuisine.",
            rating: "4.6",
            image: "/api/placeholder/400/300" // Replace with: Wine glasses and tasting setup
        },
        {
            title: "Anniversary Celebration",
            description: "A memorable anniversary celebration with dancing and dining.",
            rating: "4.5",
            image: "/api/placeholder/400/300" // Replace with: Celebration setup with elegant table arrangements
        }
    ];

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
    };

    const handleContactSubmit = () => {
        const subject = encodeURIComponent('Event Inquiry - Glamour Events');
        const body = encodeURIComponent('Hello,\n\nI would like to inquire about booking an event at Glamour Events.\n\nBest regards,');
        window.location.href = `mailto:glamourevent4@gmail.com?subject=${subject}&body=${body}`;
    };

    return (
        <div className="min-h-screen bg-glamCream">
            {/* Navbar */}
            <nav className="bg-glamWhite shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo */}
                        <div className="flex items-center cursor-pointer" onClick={() => scrollToSection('home')}>
                            <div className="text-center">
                                <img src="glmr_evnt_logo.png" alt="Glamour events logo" className='w-20' />
                            </div>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex space-x-8">
                            <button onClick={() => scrollToSection('home')} className="font-cormorant text-glamDarkBrown hover:text-glamGold transition-colors">Home</button>
                            <button onClick={() => scrollToSection('upcoming')} className="font-cormorant text-glamDarkBrown hover:text-glamGold transition-colors">Upcoming Events</button>
                            <button onClick={() => scrollToSection('past')} className="font-cormorant text-glamDarkBrown hover:text-glamGold transition-colors">Past Events</button>
                            <button onClick={() => scrollToSection('about')} className="font-cormorant text-glamDarkBrown hover:text-glamGold transition-colors">About Us</button>
                            <button onClick={() => scrollToSection('contact')} className="font-cormorant text-glamDarkBrown hover:text-glamGold transition-colors">Contact</button>
                        </div>

                        {/* Desktop Book Event Button */}
                        <button
                            onClick={() => scrollToSection('contact')}
                            className="hidden md:block bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold px-6 py-2 rounded-full transition-colors"
                        >
                            Book Event
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-md text-glamDarkBrown hover:text-glamGold"
                        >
                            <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="text-2xl" />
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-glamGold/20">
                            <div className="flex flex-col space-y-2">
                                <button onClick={() => scrollToSection('home')} className="font-cormorant text-glamDarkBrown hover:text-glamGold transition-colors text-left py-2">Home</button>
                                <button onClick={() => scrollToSection('upcoming')} className="font-cormorant text-glamDarkBrown hover:text-glamGold transition-colors text-left py-2">Upcoming Events</button>
                                <button onClick={() => scrollToSection('past')} className="font-cormorant text-glamDarkBrown hover:text-glamGold transition-colors text-left py-2">Past Events</button>
                                <button onClick={() => scrollToSection('about')} className="font-cormorant text-glamDarkBrown hover:text-glamGold transition-colors text-left py-2">About Us</button>
                                <button onClick={() => scrollToSection('contact')} className="font-cormorant text-glamDarkBrown hover:text-glamGold transition-colors text-left py-2">Contact</button>
                                <button
                                    onClick={() => scrollToSection('contact')}
                                    className="bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold px-6 py-2 rounded-full transition-colors mt-4 w-fit"
                                >
                                    Book Event
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="py-20 text-center bg-gradient-to-b from-glamWhite to-glamCream">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Main Logo with Flourish */}
                    <div className="mb-8 flex justify-center">
                        <img src="glmr_evnt_logo.png" alt="Glamour events logo" className='w-96' />
                    </div>

                    <h2 className="font-cormorant text-3xl text-glamDarkBrown mb-8">
                        MAKE YOUR EVENT UNFORGETTABLE
                    </h2>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => scrollToSection('upcoming')}
                            className="bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold px-8 py-3 rounded-full transition-colors shadow-lg"
                        >
                            View Events
                        </button>
                        <button
                            onClick={() => scrollToSection('contact')}
                            className="border-2 border-glamGold text-glamGold hover:bg-glamGold hover:text-glamDarkBrown font-cormorant font-semibold px-8 py-3 rounded-full transition-colors"
                        >
                            Book Event
                        </button>
                    </div>
                </div>
            </section>

            {/* Upcoming Events Section */}
            <section id="upcoming" className="py-16 bg-glamWhite">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-satisfy font-satisfy-bold text-4xl text-glamDarkBrown mb-4">Upcoming Events</h2>
                        <p className="font-cormorant text-lg text-glamDarkBrown/80 max-w-2xl mx-auto">
                            Discover exciting experiences happening soon at Glamour Events, Rayfield, Jos.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {upcomingEvents.map((event, index) => (
                            <EventCard
                                key={`upcoming-${index}`}
                                title={event.title}
                                description={event.description}
                                date={event.date}
                                location={event.location}
                                image={event.image}
                                isUpcoming={true}
                                onButtonClick={() => scrollToSection('contact')}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Past Events Section */}
            <section id="past" className="py-16 bg-glamCream">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-satisfy font-satisfy-bold text-4xl text-glamDarkBrown mb-4">Past Events</h2>
                        <p className="font-cormorant text-lg text-glamDarkBrown/80">
                            Relive moments from our unforgettable gatherings.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pastEvents.map((event, index) => (
                            <EventCard
                                key={`past-${index}`}
                                title={event.title}
                                description={event.description}
                                image={event.image}
                                rating={event.rating}
                                isUpcoming={false}
                                onButtonClick={() => scrollToSection('contact')}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="py-16 bg-glamWhite">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="font-satisfy font-satisfy-bold text-4xl text-glamDarkBrown mb-8">About Glamour Events</h2>
                    <div className="bg-glamCream p-8 rounded-lg shadow-md">
                        <p className="font-cormorant text-lg text-glamDarkBrown/80 leading-relaxed mb-6">
                            Located in the heart of Rayfield, Jos, Plateau State, Glamour Events offers a premier venue for weddings,
                            parties, conferences, and unforgettable experiences.
                        </p>
                        <p className="font-cormorant text-lg text-glamDarkBrown/80 leading-relaxed">
                            With elegant spaces, top-class facilities, and a dedicated team, we make every occasion special. From intimate
                            gatherings to grand celebrations, we provide the perfect backdrop for your most important moments.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 bg-glamCream">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-satisfy font-satisfy-bold text-4xl text-glamDarkBrown mb-8">Get in Touch</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div className="bg-glamWhite p-6 rounded-lg shadow-md">
                                <h3 className="font-satisfy font-satisfy-bold text-2xl text-glamDarkBrown mb-6 text-center">Contact Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-4">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-glamGold text-2xl mt-1" />
                                        <div>
                                            <p className="font-cormorant text-glamDarkBrown font-semibold">Location</p>
                                            <p className="font-cormorant text-glamDarkBrown/80">Glamour Events<br />Rayfield, Jos<br />Plateau State, Nigeria</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <FontAwesomeIcon icon={faPhone} className="text-glamGold text-2xl" />
                                        <div>
                                            <p className="font-cormorant text-glamDarkBrown font-semibold">Phone</p>
                                            <a href="tel:+2348026544982" className="font-cormorant text-glamDarkBrown/80 hover:text-glamGold transition-colors">
                                                +234 802 654 4982
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <FontAwesomeIcon icon={faEnvelope} className="text-glamGold text-2xl" />
                                        <div>
                                            <p className="font-cormorant text-glamDarkBrown font-semibold">Email</p>
                                            <a href="mailto:glamourevent4@gmail.com" className="font-cormorant text-glamDarkBrown/80 hover:text-glamGold transition-colors">
                                                glamourevent4@gmail.com
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div className="bg-glamWhite p-6 rounded-lg shadow-md">
                                <h3 className="font-satisfy font-satisfy-bold text-2xl text-glamDarkBrown mb-4 text-center">Business Hours</h3>
                                <div className="space-y-2 text-center">
                                    <p className="font-cormorant text-glamDarkBrown"><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                                    <p className="font-cormorant text-glamDarkBrown"><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                                    <p className="font-cormorant text-glamDarkBrown"><strong>Sunday:</strong> By Appointment</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-glamWhite p-6 rounded-lg shadow-md">
                            <h3 className="font-satisfy font-satisfy-bold text-2xl text-glamDarkBrown mb-6 text-center">Send us a Message</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full p-3 border border-glamGold/30 rounded font-cormorant focus:outline-none focus:border-glamGold transition-colors"
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="w-full p-3 border border-glamGold/30 rounded font-cormorant focus:outline-none focus:border-glamGold transition-colors"
                                />
                                <input
                                    type="tel"
                                    placeholder="Your Phone Number"
                                    className="w-full p-3 border border-glamGold/30 rounded font-cormorant focus:outline-none focus:border-glamGold transition-colors"
                                />
                                <select className="w-full p-3 border border-glamGold/30 rounded font-cormorant focus:outline-none focus:border-glamGold transition-colors">
                                    <option value="">Select Event Type</option>
                                    <option value="wedding">Wedding</option>
                                    <option value="corporate">Corporate Event</option>
                                    <option value="party">Private Party</option>
                                    <option value="conference">Conference</option>
                                    <option value="other">Other</option>
                                </select>
                                <textarea
                                    placeholder="Tell us about your event..."
                                    rows={4}
                                    className="w-full p-3 border border-glamGold/30 rounded font-cormorant focus:outline-none focus:border-glamGold transition-colors resize-none"
                                ></textarea>
                                <button
                                    onClick={handleContactSubmit}
                                    className="w-full bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold py-3 rounded-full transition-colors shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} className="align-middle mr-2" />
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-glamDarkBrown text-glamWhite py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        {/* Logo and Description */}
                        <div className="text-center md:text-left">
                            <div className="mb-4">
                                <div className="font-satisfy font-satisfy-bold text-3xl text-glamGold mb-2">Glamour Events</div>
                                <div className="font-cormorant text-sm tracking-widest">RAYFIELD, JOS</div>
                            </div>
                            <p className="font-cormorant text-sm text-glamWhite/80 leading-relaxed">
                                Creating unforgettable moments and elegant experiences in the heart of Plateau State.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="text-center">
                            <h4 className="font-satisfy font-satisfy-bold text-xl text-glamGold mb-4">Quick Links</h4>
                            <div className="space-y-2">
                                <button onClick={() => scrollToSection('home')} className="block font-cormorant hover:text-glamGold transition-colors mx-auto">Home</button>
                                <button onClick={() => scrollToSection('upcoming')} className="block font-cormorant hover:text-glamGold transition-colors mx-auto">Upcoming Events</button>
                                <button onClick={() => scrollToSection('past')} className="block font-cormorant hover:text-glamGold transition-colors mx-auto">Past Events</button>
                                <button onClick={() => scrollToSection('about')} className="block font-cormorant hover:text-glamGold transition-colors mx-auto">About Us</button>
                                <button onClick={() => scrollToSection('contact')} className="block font-cormorant hover:text-glamGold transition-colors mx-auto">Contact</button>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="text-center md:text-right">
                            <h4 className="font-satisfy font-satisfy-bold text-xl text-glamGold mb-4">Get in Touch</h4>
                            <div className="space-y-2 font-cormorant text-sm">
                                <p className="flex items-center justify-center md:justify-end">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-glamGold mr-2 text-base" />
                                    Rayfield, Jos, Plateau State
                                </p>
                                <p className="flex items-center justify-center md:justify-end">
                                    <FontAwesomeIcon icon={faPhone} className="text-glamGold mr-2 text-base" />
                                    <a href="tel:+2348026544982" className="hover:text-glamGold transition-colors">
                                        +234 802 654 4982
                                    </a>
                                </p>
                                <p className="flex items-center justify-center md:justify-end">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-glamGold mr-2 text-base" />
                                    <a href="mailto:glamourevent4@gmail.com" className="hover:text-glamGold transition-colors">
                                        glamourevent4@gmail.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="border-t border-glamGold/30 pt-8 text-center">
                        <div className="flex justify-center space-x-6 mb-4">
                            <a href="#" className="text-glamWhite hover:text-glamGold transition-colors">
                                <FontAwesomeIcon icon={faFacebook} className="text-2xl" />
                            </a>
                            <a href="#" className="text-glamWhite hover:text-glamGold transition-colors">
                                <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
                            </a>
                            <a href="#" className="text-glamWhite hover:text-glamGold transition-colors">
                                <FontAwesomeIcon icon={faTwitter} className="text-2xl" />
                            </a>
                            <a href="#" className="text-glamWhite hover:text-glamGold transition-colors">
                                <FontAwesomeIcon icon={faYoutube} className="text-2xl" />
                            </a>
                        </div>

                        <div className="border-t border-glamGold/20 pt-6">
                            <p className="font-cormorant text-sm text-glamWhite/60">
                                © 2025 Glamour Events. All Rights Reserved. |
                                <span className="text-glamGold"> Designed with ♥ for unforgettable moments</span>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default GlamourHomepage;