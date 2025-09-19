import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faCalendarAlt, 
  faStar, 
  faComments, 
  faThumbsUp, 
  faArrowUp, 
  faArrowDown, 
  faMinus,
  faSpinner,
  faChartLine,
  faEye,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import useEventStore from '../store/eventStore';
import useAuthStore from '../store/authStore';

// Utility function to calculate percentage change
const calculatePercentageChange = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

// Utility function to format percentage
const formatPercentage = (value) => {
  const absValue = Math.abs(value);
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${absValue.toFixed(1)}%`;
};

// Utility function to get change icon and color
const getChangeIndicator = (value) => {
  if (value > 0) {
    return { icon: faArrowUp, color: 'text-green-500', bgColor: 'bg-green-100' };
  } else if (value < 0) {
    return { icon: faArrowDown, color: 'text-red-500', bgColor: 'bg-red-100' };
  } else {
    return { icon: faMinus, color: 'text-gray-500', bgColor: 'bg-gray-100' };
  }
};

// Metric Card Component
const MetricCard = ({ title, value, previousValue, icon, color = 'text-glamGold', bgColor = 'bg-glamGold/10' }) => {
  const change = calculatePercentageChange(value, previousValue);
  const indicator = getChangeIndicator(change);

  return (
    <div className="bg-glamWhite rounded-lg shadow-lg p-6 border border-glamGold/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-cormorant text-glamDarkBrown/60 text-sm font-medium">{title}</p>
          <p className="font-satisfy text-3xl text-glamDarkBrown font-bold mt-2">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-full`}>
          <FontAwesomeIcon icon={icon} className={`text-2xl ${color}`} />
        </div>
      </div>
      
      {previousValue !== undefined && (
        <div className="mt-4 flex items-center">
          <div className={`${indicator.bgColor} px-2 py-1 rounded-full flex items-center space-x-1`}>
            <FontAwesomeIcon icon={indicator.icon} className={`text-xs ${indicator.color}`} />
            <span className={`text-xs font-cormorant font-medium ${indicator.color}`}>
              {formatPercentage(change)}
            </span>
          </div>
          <span className="font-cormorant text-glamDarkBrown/60 text-xs ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
};

// Event List Component
const EventList = ({ events, title, type = 'upcoming' }) => {
  if (!events || events.length === 0) {
    return (
      <div className="bg-glamWhite rounded-lg shadow-lg p-6 border border-glamGold/20">
        <h3 className="font-satisfy text-xl text-glamDarkBrown font-bold mb-4">{title}</h3>
        <div className="text-center py-8">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-4xl text-glamGold/40 mb-4" />
          <p className="font-cormorant text-glamDarkBrown/60">No {type} events available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-glamWhite rounded-lg shadow-lg p-6 border border-glamGold/20">
      <h3 className="font-satisfy text-xl text-glamDarkBrown font-bold mb-4">{title}</h3>
      <div className="space-y-3">
        {events.map((event, index) => (
          <div key={event._id || index} className="flex items-center justify-between p-3 bg-glamCream/30 rounded-lg">
            <div className="flex-1">
              <h4 className="font-cormorant text-glamDarkBrown font-semibold">{event.title}</h4>
              <p className="font-cormorant text-glamDarkBrown/60 text-sm">
                {new Date(event.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {event.totalReviews !== undefined && (
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <FontAwesomeIcon icon={faStar} className="text-glamGold text-sm" />
                    <span className="font-cormorant text-glamDarkBrown/70 text-sm">
                      {event.averageRating || 0}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FontAwesomeIcon icon={faComments} className="text-glamGold text-sm" />
                    <span className="font-cormorant text-glamDarkBrown/70 text-sm">
                      {event.totalReviews} reviews
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FontAwesomeIcon icon={faThumbsUp} className="text-glamGold text-sm" />
                    <span className="font-cormorant text-glamDarkBrown/70 text-sm">
                      {event.recommendationPercentage || 0}%
                    </span>
                  </div>
                </div>
              )}
            </div>
            <button className="text-glamGold hover:text-glamCreamDark transition-colors">
              <FontAwesomeIcon icon={faEye} className="text-lg" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { getAdminData, isLoading } = useEventStore();
  const { user, accessToken, isAuthenticated } = useAuthStore();
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!isAuthenticated || !accessToken) {
        navigate('/signin');
        return;
      }

      // Check if user is admin
      if (user?.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        return;
      }

      console.log('Fetching admin data...', { accessToken: !!accessToken, userRole: user?.role });
      const result = await getAdminData(accessToken);
      console.log('Admin data result:', result);
      
      if (result.success) {
        setAdminData(result.data);
        setError(null);
      } else {
        console.error('Admin data error:', result.error);
        setError(result.error);
      }
    };

    fetchAdminData();
  }, [isAuthenticated, accessToken, navigate, getAdminData, user?.role]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-glamCream flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-satisfy text-2xl text-glamDarkBrown mb-4">Access Denied</h2>
          <p className="font-cormorant text-glamDarkBrown/60">Please sign in to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-glamCream flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-glamGold mb-4" />
          <p className="font-cormorant text-glamDarkBrown">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-glamCream flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-satisfy text-2xl text-glamDarkBrown mb-4">Error</h2>
          <p className="font-cormorant text-glamDarkBrown/60">{error}</p>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-glamCream flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-satisfy text-2xl text-glamDarkBrown mb-4">No Data Available</h2>
          <p className="font-cormorant text-glamDarkBrown/60">Unable to load dashboard data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-glamCream">
      {/* Header */}
      <div className="bg-glamWhite shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-satisfy text-3xl text-glamDarkBrown font-bold">Admin Dashboard</h1>
              <p className="font-cormorant text-glamDarkBrown/60 mt-1">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/events/create')}
                className="bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold px-6 py-2 rounded-full transition-colors"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Create Event
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Users"
            value={adminData.totalUsers}
            icon={faUsers}
            color="text-blue-500"
            bgColor="bg-blue-100"
          />
          <MetricCard
            title="Total Events"
            value={adminData.totalEvents}
            icon={faCalendarAlt}
            color="text-glamGold"
            bgColor="bg-glamGold/10"
          />
          <MetricCard
            title="Upcoming Events"
            value={adminData.upcomingEventsCount}
            icon={faChartLine}
            color="text-green-500"
            bgColor="bg-green-100"
          />
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Average Rating"
            value={adminData.currentMonth.averageRating}
            previousValue={adminData.previousMonth.averageRating}
            icon={faStar}
            color="text-yellow-500"
            bgColor="bg-yellow-100"
          />
          <MetricCard
            title="Total Reviews"
            value={adminData.currentMonth.totalReviews}
            previousValue={adminData.previousMonth.totalReviews}
            icon={faComments}
            color="text-purple-500"
            bgColor="bg-purple-100"
          />
          <MetricCard
            title="Recommendation %"
            value={`${adminData.currentMonth.recommendationPercentage}%`}
            previousValue={adminData.previousMonth.recommendationPercentage}
            icon={faThumbsUp}
            color="text-green-500"
            bgColor="bg-green-100"
          />
        </div>

        {/* Event Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EventList
            events={adminData.upcomingEvents}
            title="Upcoming Events"
            type="upcoming"
          />
          <EventList
            events={adminData.pastEvents}
            title="Recent Past Events"
            type="past"
          />
        </div>

        {/* Improvement Summary */}
        <div className="mt-8 bg-glamWhite rounded-lg shadow-lg p-6 border border-glamGold/20">
          <h3 className="font-satisfy text-xl text-glamDarkBrown font-bold mb-6">Month-over-Month Improvements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${
                adminData.improvements.ratingImprovement >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <FontAwesomeIcon 
                  icon={adminData.improvements.ratingImprovement >= 0 ? faArrowUp : faArrowDown} 
                  className="mr-2" 
                />
                <span className="font-cormorant font-semibold">
                  {formatPercentage(adminData.improvements.ratingImprovement)}
                </span>
              </div>
              <p className="font-cormorant text-glamDarkBrown/60 text-sm mt-2">Rating Improvement</p>
            </div>
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${
                adminData.improvements.reviewsImprovement >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <FontAwesomeIcon 
                  icon={adminData.improvements.reviewsImprovement >= 0 ? faArrowUp : faArrowDown} 
                  className="mr-2" 
                />
                <span className="font-cormorant font-semibold">
                  {formatPercentage(adminData.improvements.reviewsImprovement)}
                </span>
              </div>
              <p className="font-cormorant text-glamDarkBrown/60 text-sm mt-2">Reviews Growth</p>
            </div>
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${
                adminData.improvements.recommendationImprovement >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <FontAwesomeIcon 
                  icon={adminData.improvements.recommendationImprovement >= 0 ? faArrowUp : faArrowDown} 
                  className="mr-2" 
                />
                <span className="font-cormorant font-semibold">
                  {formatPercentage(adminData.improvements.recommendationImprovement)}
                </span>
              </div>
              <p className="font-cormorant text-glamDarkBrown/60 text-sm mt-2">Recommendation Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
