import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faMapMarkerAlt, 
  faStar, 
  faUserPlus, 
  faEdit,
  faClock,
  faCalendarPlus,
  faHistory
} from '@fortawesome/free-solid-svg-icons';

// Empty State Component for when no events are available
const EmptyEventState = ({ isUpcoming = true }) => {
  return (
    <div className="bg-glamWhite border-2 border-glamGold/30 rounded-lg shadow-lg p-8 max-w-sm mx-auto text-center relative">
      {/* Decorative Corner Flourishes */}
      <div className="absolute top-0 left-0 w-16 h-16 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-glamGold">
          <path d="M20,20 Q40,10 60,20 Q50,40 60,60 Q40,50 20,60 Q30,40 20,20"/>
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-16 h-16 opacity-10 transform rotate-180">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-glamGold">
          <path d="M20,20 Q40,10 60,20 Q50,40 60,60 Q40,50 20,60 Q30,40 20,20"/>
        </svg>
      </div>

      {/* Icon */}
      <div className="mb-6">
        <FontAwesomeIcon 
          icon={isUpcoming ? faCalendarPlus : faHistory} 
          className="text-6xl text-glamGold/60" 
        />
      </div>

      {/* Decorative Divider */}
      <div className="flex justify-center mb-6">
        <div className="w-12 h-0.5 bg-glamGold/30"></div>
        <div className="w-2 h-2 bg-glamGold/30 rounded-full mx-2 -mt-0.75"></div>
        <div className="w-12 h-0.5 bg-glamGold/30"></div>
      </div>

      {/* Title */}
      <h3 className="font-satisfy font-satisfy-bold text-2xl text-glamDarkBrown mb-4">
        {isUpcoming ? 'No Upcoming Events' : 'No Past Events'}
      </h3>

      {/* Description */}
      <p className="font-cormorant text-glamDarkBrown/70 mb-6 leading-relaxed">
        {isUpcoming 
          ? 'We\'re working on bringing you amazing experiences. Check back soon for exciting upcoming events!'
          : 'No past events to display at the moment. Stay tuned for future events that will be featured here.'
        }
      </p>

      {/* Decorative Bottom Divider */}
      <div className="flex justify-center mb-6">
        <div className="w-8 h-0.5 bg-glamGold/30"></div>
        <div className="w-1.5 h-1.5 bg-glamGold/30 rounded-full mx-2 -mt-0.5"></div>
        <div className="w-8 h-0.5 bg-glamGold/30"></div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center justify-center space-x-2 text-sm font-cormorant">
        <FontAwesomeIcon 
          icon={isUpcoming ? faClock : faStar} 
          className={isUpcoming ? 'text-glamGold/60' : 'text-glamDarkBrown/40'} 
        />
        <span className={isUpcoming ? 'text-glamGold/60' : 'text-glamDarkBrown/40'}>
          {isUpcoming ? 'Stay Tuned' : 'Coming Soon'}
        </span>
      </div>
    </div>
  );
};

// Event Card Component (Wedding Invitation Style)
const EventCard = ({ 
  title, 
  description, 
  date, 
  location, 
  image, 
  isUpcoming = true, 
  rating = null, 
  averageRating = null,
  totalReviews = 0,
  eventId,
  category,
  buttonText = "View Event",
  onButtonClick = () => {} 
}) => {
  const navigate = useNavigate();
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
          {/* Category Badge */}
          {category && (
            <div className="absolute top-2 right-2 bg-glamGold text-glamDarkBrown px-2 py-1 rounded-full text-xs font-cormorant font-semibold">
              {category}
            </div>
          )}
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
      {(rating || averageRating) && (
        <div className="text-center mb-4">
          <div className="flex justify-center items-center space-x-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={faStar}
                  className={`text-sm ${
                    star <= (averageRating || rating)
                      ? 'text-glamGold'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-glamGold text-lg font-cormorant">
              {averageRating ? averageRating.toFixed(1) : rating}/5
            </span>
            {totalReviews > 0 && (
              <span className="text-glamDarkBrown/60 text-sm font-cormorant">
                ({totalReviews} review{totalReviews > 1 ? 's' : ''})
              </span>
            )}
          </div>
        </div>
      )}

      {/* Decorative Bottom Divider */}
      <div className="flex justify-center mb-4">
        <div className="w-8 h-0.5 bg-glamGold"></div>
        <div className="w-1.5 h-1.5 bg-glamGold rounded-full mx-2 -mt-0.5"></div>
        <div className="w-8 h-0.5 bg-glamGold"></div>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-y-3">
        {/* Primary Action Button */}
        <button 
          onClick={onButtonClick}
          className="bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold py-2 px-6 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-105 w-full"
        >
          {buttonText}
        </button>

        {/* Secondary Action Button */}
        {isUpcoming ? (
          <button 
            onClick={() => {
              // RSVP functionality - you can implement this later
              console.log('RSVP clicked for event:', eventId);
              // For now, just show an alert
              alert('RSVP functionality coming soon!');
            }}
            className="bg-glamCream hover:bg-glamGold/20 text-glamDarkBrown font-cormorant font-medium py-2 px-4 rounded-full transition-colors duration-300 border border-glamGold/30 hover:border-glamGold w-full flex items-center justify-center space-x-2"
          >
            <FontAwesomeIcon icon={faUserPlus} className="text-sm" />
            <span>RSVP</span>
          </button>
        ) : (
          <button 
            onClick={() => {
              if (eventId) {
                navigate(`/events/${eventId}/review`);
              }
            }}
            className="bg-glamCream hover:bg-glamGold/20 text-glamDarkBrown font-cormorant font-medium py-2 px-4 rounded-full transition-colors duration-300 border border-glamGold/30 hover:border-glamGold w-full flex items-center justify-center space-x-2"
          >
            <FontAwesomeIcon icon={faEdit} className="text-sm" />
            <span>Write Review</span>
          </button>
        )}

        {/* Event Status Indicator */}
        <div className="flex items-center justify-center space-x-2 text-sm font-cormorant">
          <FontAwesomeIcon 
            icon={isUpcoming ? faClock : faStar} 
            className={isUpcoming ? 'text-glamGold' : 'text-glamDarkBrown/60'} 
          />
          <span className={isUpcoming ? 'text-glamGold' : 'text-glamDarkBrown/60'}>
            {isUpcoming ? 'Upcoming Event' : 'Past Event'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Events List Component that handles empty states
const EventsList = ({ events, isUpcoming = true, onEventClick }) => {
  if (!events || events.length === 0) {
    return <EmptyEventState isUpcoming={isUpcoming} />;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
            <EventCard
          key={event._id}
          title={event.title}
          description={event.description}
          date={event.date}
          location={event.location}
          image={event.banner}
          category={event.category}
          eventId={event._id}
          averageRating={event.analytics?.averageRating}
          totalReviews={event.analytics?.totalReviews}
          isUpcoming={isUpcoming}
          onButtonClick={() => onEventClick(event._id)}
        />
      ))}
    </div>
  );
};

export default EventCard;
export { EmptyEventState, EventsList };