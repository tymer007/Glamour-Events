import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useEventStore from '../store/eventStore';
import { 
  faArrowLeft, 
  faStar, 
  faCalendarAlt, 
  faMapMarkerAlt, 
  faTag,
  faUsers,
  faClock,
  faSpinner,
  faUserPlus,
  faShare,
  faHeart,
  faEdit,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UpcomingEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { getAdminEvent, isLoading, error } = useEventStore();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (eventId) {
        const result = await getAdminEvent(eventId);
        if (result.success) {
          setEvent(result.data);
        }
      }
    };

    fetchEvent();
  }, [eventId, getAdminEvent]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeUntil = (dateString) => {
    const now = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate - now;
    
    if (diffTime < 0) {
      return 'Event has passed';
    }
    
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''} remaining`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''} remaining`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''} remaining`;
    }
  };

  const renderStars = (rating, size = 'sm') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <FontAwesomeIcon 
            key={i} 
            icon={faStar} 
            className={`text-yellow-400 ${size === 'lg' ? 'text-2xl' : 'text-sm'}`} 
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <FontAwesomeIcon 
            key={i} 
            icon={faStar} 
            className={`text-yellow-400 ${size === 'lg' ? 'text-2xl' : 'text-sm'} opacity-50`} 
          />
        );
      } else {
        stars.push(
          <FontAwesomeIcon 
            key={i} 
            icon={faStar} 
            className={`text-gray-300 ${size === 'lg' ? 'text-2xl' : 'text-sm'}`} 
          />
        );
      }
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-purple-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Event</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
            <div className="text-gray-500 text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
            <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Event Details</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <FontAwesomeIcon icon={faShare} className="text-lg" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <FontAwesomeIcon icon={faHeart} className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Hero Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {event.banner && (
            <div className="relative h-64 md:h-80">
              <img 
                src={event.banner} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="absolute top-4 right-4">
                <span className="bg-glamGold text-glamDarkBrown px-3 py-1 rounded-full text-sm font-semibold">
                  {event.category}
                </span>
              </div>
            </div>
          )}
          
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">{event.description}</p>
                
                <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-purple-600" />
                    <span className="font-medium">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-purple-600" />
                    <span className="font-medium">{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faTag} className="mr-2 text-purple-600" />
                    <span className="font-medium">{event.category}</span>
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faClock} className="text-purple-600 mr-3 text-xl" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Event Starts In</h3>
                      <p className="text-purple-600 font-bold text-lg">{formatTimeUntil(event.date)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="lg:ml-8 space-y-4">
                <button className="w-full bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                  RSVP Now
                </button>
                
                <button className="w-full bg-white border-2 border-glamGold text-glamGold hover:bg-glamGold hover:text-glamDarkBrown font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
                  <FontAwesomeIcon icon={faShare} className="mr-2" />
                  Share Event
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Event Stats */}
        {event.analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="flex justify-center mb-3">
                <FontAwesomeIcon icon={faUsers} className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{event.analytics.totalReviews}</h3>
              <p className="text-gray-600">Total Reviews</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="flex justify-center mb-3">
                <FontAwesomeIcon icon={faStar} className="text-3xl text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{event.analytics.averageRating || 0}</h3>
              <p className="text-gray-600">Average Rating</p>
              <div className="flex justify-center mt-2">
                {renderStars(event.analytics.averageRating || 0)}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="flex justify-center mb-3">
                <FontAwesomeIcon icon={faChartBar} className="text-3xl text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {event.analytics.wouldRecommend || 0}
              </h3>
              <p className="text-gray-600">Would Recommend</p>
            </div>
          </div>
        )}

        {/* Event Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {event.description || 'No additional details available for this event.'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Event Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Event Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Date & Time</label>
                  <p className="text-gray-900">{formatDate(event.date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-900">{event.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p className="text-gray-900">{event.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Upcoming
                  </span>
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            {event.createdBy && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Organizer</h3>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-glamGold rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUsers} className="text-glamDarkBrown" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{event.createdBy.name}</p>
                    <p className="text-sm text-gray-500">Event Organizer</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvent;
