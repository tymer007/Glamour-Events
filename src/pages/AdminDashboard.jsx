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
  faEdit,
  faUserCog,
  faChartBar,
  faCog,
  faBell
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

// Utility function to get change indicator
const getChangeIndicator = (value) => {
  if (value > 0) {
    return { icon: faArrowUp, color: 'text-green-600', bgColor: 'bg-green-50' };
  } else if (value < 0) {
    return { icon: faArrowDown, color: 'text-red-600', bgColor: 'bg-red-50' };
  } else {
    return { icon: faMinus, color: 'text-gray-500', bgColor: 'bg-gray-50' };
  }
};

// Modern Metric Card Component
const MetricCard = ({ title, value, previousValue, icon, gradient = 'from-blue-500 to-blue-600' }) => {
  const change = calculatePercentageChange(value, previousValue);
  const indicator = getChangeIndicator(change);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${gradient}`}>
          <FontAwesomeIcon icon={icon} className="text-white text-xl" />
        </div>
        {previousValue !== undefined && (
          <div className={`${indicator.bgColor} px-3 py-1 rounded-full flex items-center space-x-1`}>
            <FontAwesomeIcon icon={indicator.icon} className={`text-xs ${indicator.color}`} />
            <span className={`text-xs font-semibold ${indicator.color}`}>
              {formatPercentage(change)}
            </span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="font-cormorant text-gray-600 text-sm font-medium mb-1">{title}</h3>
        <p className="font-cormorant text-3xl font-bold text-gray-900">{value}</p>
        {previousValue !== undefined && (
          <p className="font-cormorant text-gray-500 text-sm mt-1">vs last month</p>
        )}
      </div>
    </div>
  );
};

// Modern Event List Component
const EventList = ({ events, title, type = 'upcoming', onEventClick }) => {
  if (!events || events.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-cormorant text-xl font-bold text-gray-900">{title}</h3>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
            0 events
          </span>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-2xl text-gray-400" />
          </div>
          <p className="font-cormorant text-gray-500 text-lg">No {type} events available</p>
          <p className="font-cormorant text-gray-400 text-sm mt-2">Events will appear here once created</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-cormorant text-xl font-bold text-gray-900">{title}</h3>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          {events.length} events
        </span>
      </div>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div 
            key={event._id || index} 
            className="group border border-gray-100 rounded-lg p-4 hover:border-glamGold hover:shadow-sm transition-all duration-200 cursor-pointer"
            onClick={() => onEventClick && onEventClick(event._id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-cormorant text-gray-900 font-semibold text-lg group-hover:text-glamGold transition-colors">
                    {event.title}
                  </h4>
                  <button 
                    className="opacity-0 group-hover:opacity-100 text-glamGold hover:text-glamCreamDark transition-all duration-200 ml-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick && onEventClick(event._id);
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} className="text-lg" />
                  </button>
                </div>
                
                <div className="flex items-center text-gray-500 mb-3">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-sm mr-2" />
                  <span className="font-cormorant text-sm">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                {event.totalReviews !== undefined && (
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-sm" />
                        <span className="font-cormorant text-gray-700 font-medium text-sm">
                          {event.averageRating || 0}
                        </span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="font-cormorant text-gray-600 text-sm">
                        {event.totalReviews} reviews
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FontAwesomeIcon icon={faThumbsUp} className="text-green-500 text-sm" />
                      <span className="font-cormorant text-gray-700 font-medium text-sm">
                        {event.recommendationPercentage || 0}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Quick Stats Component
const QuickStatsCard = ({ adminData }) => {
  const currentMonth = adminData.currentMonth || {};
  const improvements = adminData.improvements || {};
  
  return (
    <div className="bg-gradient-to-r from-glamGold to-glamCreamDark rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-cormorant text-xl font-bold">This Month's Performance</h3>
        <FontAwesomeIcon icon={faChartLine} className="text-2xl opacity-80" />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold mb-1">{currentMonth.averageRating || 0}</div>
          <div className="text-sm opacity-90">Avg Rating</div>
          <div className="text-xs opacity-75 mt-1">
            {formatPercentage(improvements.ratingImprovement || 0)} vs last month
          </div>
        </div>
        <div className="text-center border-x border-white/20">
          <div className="text-2xl font-bold mb-1">{currentMonth.totalReviews || 0}</div>
          <div className="text-sm opacity-90">Total Reviews</div>
          <div className="text-xs opacity-75 mt-1">
            {formatPercentage(improvements.reviewsImprovement || 0)} vs last month
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold mb-1">{currentMonth.recommendationPercentage || 0}%</div>
          <div className="text-sm opacity-90">Recommended</div>
          <div className="text-xs opacity-75 mt-1">
            {formatPercentage(improvements.recommendationImprovement || 0)} vs last month
          </div>
        </div>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faUserCog} className="text-2xl text-red-600" />
          </div>
          <h2 className="font-cormorant text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="font-cormorant text-gray-600">Please sign in to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-glamGold mb-4" />
          <p className="font-cormorant text-gray-700 text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faUserCog} className="text-2xl text-red-600" />
          </div>
          <h2 className="font-cormorant text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="font-cormorant text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faChartBar} className="text-2xl text-gray-400" />
          </div>
          <h2 className="font-cormorant text-2xl font-bold text-gray-900 mb-2">No Data Available</h2>
          <p className="font-cormorant text-gray-600">Unable to load dashboard data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-cormorant text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <p className="font-cormorant text-gray-600">Welcome back, <span className="font-semibold text-gray-800">{user?.name}</span></p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <FontAwesomeIcon icon={faBell} className="text-lg" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <FontAwesomeIcon icon={faCog} className="text-lg" />
              </button>
              <button
                onClick={() => navigate('/create-event')}
                className="bg-glamGold hover:bg-glamCreamDark text-white font-cormorant font-semibold px-6 py-2 rounded-lg transition-colors shadow-sm"
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
        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Users"
            value={adminData.totalUsers}
            icon={faUsers}
            gradient="from-blue-500 to-blue-600"
          />
          <MetricCard
            title="Total Events"
            value={adminData.totalEvents}
            icon={faCalendarAlt}
            gradient="from-glamGold to-glamCreamDark"
          />
          <MetricCard
            title="Upcoming Events"
            value={adminData.upcomingEventsCount}
            icon={faChartLine}
            gradient="from-green-500 to-green-600"
          />
          <MetricCard
            title="Past Events"
            value={adminData.pastEventsCount || adminData.pastEvents?.length || 0}
            icon={faChartBar}
            gradient="from-purple-500 to-purple-600"
          />
        </div>

        {/* Performance Overview */}
        <div className="mb-8">
          <QuickStatsCard adminData={adminData} />
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Average Rating"
            value={adminData.currentMonth?.averageRating || 0}
            previousValue={adminData.previousMonth?.averageRating}
            icon={faStar}
            gradient="from-yellow-400 to-yellow-500"
          />
          <MetricCard
            title="Total Reviews"
            value={adminData.currentMonth?.totalReviews || 0}
            previousValue={adminData.previousMonth?.totalReviews}
            icon={faComments}
            gradient="from-indigo-500 to-indigo-600"
          />
          <MetricCard
            title="Recommendation Rate"
            value={`${adminData.currentMonth?.recommendationPercentage || 0}%`}
            previousValue={adminData.previousMonth?.recommendationPercentage}
            icon={faThumbsUp}
            gradient="from-green-500 to-green-600"
          />
        </div>

        {/* Event Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EventList
            events={adminData.upcomingEvents}
            title="Upcoming Events"
            type="upcoming"
            onEventClick={(eventId) => navigate(`/events/${eventId}`)}
          />
          <EventList
            events={adminData.pastEvents}
            title="Recent Past Events"
            type="past"
            onEventClick={(eventId) => navigate(`/events/${eventId}/stats`)}
          />
        </div>

        {/* Additional Analytics Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-cormorant text-xl font-bold text-gray-900 mb-6">Month-over-Month Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`inline-flex items-center px-4 py-2 rounded-full mb-3 ${
                (adminData.improvements?.ratingImprovement || 0) >= 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                <FontAwesomeIcon 
                  icon={(adminData.improvements?.ratingImprovement || 0) >= 0 ? faArrowUp : faArrowDown} 
                  className="mr-2 text-sm" 
                />
                <span className="font-cormorant font-semibold">
                  {formatPercentage(adminData.improvements?.ratingImprovement || 0)}
                </span>
              </div>
              <h4 className="font-cormorant font-semibold text-gray-900">Rating Improvement</h4>
              <p className="font-cormorant text-gray-600 text-sm mt-1">
                Quality of events based on customer feedback
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`inline-flex items-center px-4 py-2 rounded-full mb-3 ${
                (adminData.improvements?.reviewsImprovement || 0) >= 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                <FontAwesomeIcon 
                  icon={(adminData.improvements?.reviewsImprovement || 0) >= 0 ? faArrowUp : faArrowDown} 
                  className="mr-2 text-sm" 
                />
                <span className="font-cormorant font-semibold">
                  {formatPercentage(adminData.improvements?.reviewsImprovement || 0)}
                </span>
              </div>
              <h4 className="font-cormorant font-semibold text-gray-900">Reviews Growth</h4>
              <p className="font-cormorant text-gray-600 text-sm mt-1">
                Customer engagement and feedback volume
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`inline-flex items-center px-4 py-2 rounded-full mb-3 ${
                (adminData.improvements?.recommendationImprovement || 0) >= 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                <FontAwesomeIcon 
                  icon={(adminData.improvements?.recommendationImprovement || 0) >= 0 ? faArrowUp : faArrowDown} 
                  className="mr-2 text-sm" 
                />
                <span className="font-cormorant font-semibold">
                  {formatPercentage(adminData.improvements?.recommendationImprovement || 0)}
                </span>
              </div>
              <h4 className="font-cormorant font-semibold text-gray-900">Recommendation Rate</h4>
              <p className="font-cormorant text-gray-600 text-sm mt-1">
                Customer satisfaction and loyalty metrics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;