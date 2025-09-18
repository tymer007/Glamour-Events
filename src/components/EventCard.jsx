import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

// Event Card Component (Wedding Invitation Style)
const EventCard = ({ 
  title, 
  description, 
  date, 
  location, 
  image, 
  isUpcoming = true, 
  rating = null, 
  buttonText = "View Event",
  onButtonClick = () => {} 
}) => {
  return (
    <div className="bg-glamWhite border-2 border-glamGold rounded-lg shadow-lg p-6 max-w-sm mx-auto transform hover:scale-105 transition-transform duration-300 relative overflow-hidden">
      {/* Decorative Corner Flourishes */}
      <div className="absolute top-0 left-0 w-16 h-16 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-glamGold">
          <path d="M20,20 Q40,10 60,20 Q50,40 60,60 Q40,50 20,60 Q30,40 20,20"/>
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-16 h-16 opacity-20 transform rotate-180">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-glamGold">
          <path d="M20,20 Q40,10 60,20 Q50,40 60,60 Q40,50 20,60 Q30,40 20,20"/>
        </svg>
      </div>

      {/* Event Image */}
      {image && (
        <div className="mb-4 relative">
          <img 
            src={image} 
            alt={`${title} event - elegant venue setup with lighting and decor`}
            className="w-full h-48 object-cover rounded border border-glamGold/30"
          />
        </div>
      )}

      {/* Decorative Divider */}
      <div className="flex justify-center mb-4">
        <div className="w-12 h-0.5 bg-glamGold"></div>
        <div className="w-2 h-2 bg-glamGold rounded-full mx-2 -mt-0.75"></div>
        <div className="w-12 h-0.5 bg-glamGold"></div>
      </div>

      {/* Event Title */}
      <h3 className="font-satisfy font-satisfy-bold text-2xl text-glamDarkBrown text-center mb-3">
        {title}
      </h3>

      {/* Event Description */}
      <p className="font-cormorant text-glamDarkBrown text-center mb-4 leading-relaxed text-sm">
        {description}
      </p>

      {/* Date and Location */}
      {date && (
        <div className="text-center mb-4">
          <p className="font-cormorant italic text-glamDarkBrown/80 text-sm flex items-center justify-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-base mr-1" />
            {date}
          </p>
          {location && (
            <p className="font-cormorant italic text-glamDarkBrown/80 text-sm flex items-center justify-center mt-1">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-base mr-1" />
              {location}
            </p>
          )}
        </div>
      )}

      {/* Rating (for past events) */}
      {rating && (
        <div className="text-center mb-4">
          <div className="flex justify-center items-center">
            <span className="text-glamGold text-lg font-cormorant">⭐ {rating}/5</span>
          </div>
        </div>
      )}

      {/* Decorative Bottom Divider */}
      <div className="flex justify-center mb-4">
        <div className="w-8 h-0.5 bg-glamGold"></div>
        <div className="w-1.5 h-1.5 bg-glamGold rounded-full mx-2 -mt-0.5"></div>
        <div className="w-8 h-0.5 bg-glamGold"></div>
      </div>

      {/* View Event Button */}
      <div className="text-center">
        <button 
          onClick={onButtonClick}
          className="bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold py-2 px-6 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

// Example usage component to demonstrate the EventCard
const EventCardDemo = () => {
  const sampleUpcomingEvent = {
    title: "Gala Night",
    description: "An exquisite evening of fine dining and entertainment in our grand ballroom.",
    date: "December 15, 2025",
    location: "Grand Ballroom",
    image: "/api/placeholder/300/200"
  };

  const samplePastEvent = {
    title: "Corporate Gala",
    description: "A successful corporate networking event with premium dining.",
    rating: "4.3",
    image: "/api/placeholder/300/200"
  };

  return (
    <div className="min-h-screen bg-glamCream p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Upcoming Event Card */}
          <div>
            <EventCard
              title={sampleUpcomingEvent.title}
              description={sampleUpcomingEvent.description}
              date={sampleUpcomingEvent.date}
              location={sampleUpcomingEvent.location}
              image={sampleUpcomingEvent.image}
              isUpcoming={true}
              onButtonClick={() => alert('View upcoming event clicked!')}
            />
          </div>

          {/* Past Event Card */}
          {/* <div>
            <EventCard
              title={samplePastEvent.title}
              description={samplePastEvent.description}
              image={samplePastEvent.image}
              rating={samplePastEvent.rating}
              isUpcoming={false}
              onButtonClick={() => alert('View past event clicked!')}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default EventCardDemo;