import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useEventStore from '../store/eventStore';
import { 
  faArrowLeft, 
  faStar, 
  faUsers, 
  faThumbsUp, 
  faThumbsDown,
  faChartBar,
  faChartPie,
  faChartLine,
  faCalendarAlt,
  faMapMarkerAlt,
  faTag,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EventStats = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { getEventAnalytics, isLoading, error } = useEventStore();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (eventId) {
        const result = await getEventAnalytics(eventId);
        if (result.success) {
          setAnalytics(result.data);
        }
      }
    };

    fetchAnalytics();
  }, [eventId, getEventAnalytics]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPercentage = (value) => {
    return `${value}%`;
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
          <p className="text-gray-600">Loading event analytics...</p>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Analytics</h2>
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

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
            <div className="text-gray-500 text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Analytics Data</h2>
            <p className="text-gray-600 mb-6">No analytics data available for this event.</p>
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

  const { eventInfo, summaryStats, overallRatings, detailedRatings, recommendations, demographics, chartData } = analytics;

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
              <h1 className="text-2xl font-bold text-gray-900">Event Analytics</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{eventInfo.title}</h2>
              <p className="text-gray-600 mb-4">{eventInfo.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  {formatDate(eventInfo.date)}
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  {eventInfo.location}
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faTag} className="mr-2" />
                  {eventInfo.category}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-purple-600 mb-1">
                {summaryStats.averageRating}
              </div>
              <div className="flex items-center justify-end mb-2">
                {renderStars(summaryStats.averageRating, 'lg')}
              </div>
              <div className="text-sm text-gray-500">
                {summaryStats.totalFeedbacks} reviews
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.totalFeedbacks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FontAwesomeIcon icon={faStar} className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.averageRating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FontAwesomeIcon icon={faThumbsUp} className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Recommendation</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.recommendationPercentage}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FontAwesomeIcon icon={faChartBar} className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Most Common</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.mostCommonRating.rating} Stars</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FontAwesomeIcon icon={faChartBar} className="mr-3 text-purple-600" />
              Overall Rating Distribution
            </h3>
            <div className="space-y-4">
              {overallRatings.distribution.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-sm font-medium text-gray-600">
                    {item.rating} Star{item.rating > 1 ? 's' : ''}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-600 text-right">
                    {item.count} ({item.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FontAwesomeIcon icon={faChartPie} className="mr-3 text-purple-600" />
              Recommendations
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faThumbsUp} className="text-green-600 mr-2" />
                  <span className="text-gray-700">Would Recommend</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{recommendations.wouldRecommend}</div>
                  <div className="text-sm text-gray-500">{recommendations.percentage}%</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faThumbsDown} className="text-red-600 mr-2" />
                  <span className="text-gray-700">Would Not Recommend</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{recommendations.notRecommend}</div>
                  <div className="text-sm text-gray-500">{100 - recommendations.percentage}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Ratings */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FontAwesomeIcon icon={faChartBar} className="mr-3 text-purple-600" />
            Detailed Ratings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {detailedRatings.map((category, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{category.average}</div>
                <div className="text-sm text-gray-500 mb-2">{category.category}</div>
                <div className="flex justify-center mb-2">
                  {renderStars(category.average)}
                </div>
                <div className="text-xs text-gray-400">{category.totalResponses} responses</div>
              </div>
            ))}
          </div>
        </div>

        {/* Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FontAwesomeIcon icon={faUsers} className="mr-3 text-purple-600" />
              Age Groups
            </h3>
            <div className="space-y-3">
              {demographics.ageGroups.map((group, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{group.ageGroup}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${group.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {group.count} ({group.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FontAwesomeIcon icon={faChartPie} className="mr-3 text-purple-600" />
              Visitor Type
            </h3>
            <div className="space-y-4">
              {demographics.firstTimeVisitors.pieChartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{item.label}</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Summary */}
        {analytics.reviews && analytics.reviews.totalReviews > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FontAwesomeIcon icon={faChartLine} className="mr-3 text-purple-600" />
              Reviews Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {analytics.reviews.enjoyedMost.count}
                </div>
                <div className="text-sm text-gray-500">Enjoyed Most</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {analytics.reviews.improvements.count}
                </div>
                <div className="text-sm text-gray-500">Improvements</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {analytics.reviews.additional.count}
                </div>
                <div className="text-sm text-gray-500">Additional Comments</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventStats;
