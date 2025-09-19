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
  faSpinner,
  faEye,
  faEdit
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
            className={`text-glamGold ${size === 'lg' ? 'text-2xl' : 'text-sm'}`} 
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <FontAwesomeIcon 
            key={i} 
            icon={faStar} 
            className={`text-glamGold ${size === 'lg' ? 'text-2xl' : 'text-sm'} opacity-50`} 
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
      <div className="min-h-screen bg-gradient-to-br from-glamCream to-glamGold/20 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-glamGold animate-spin mb-4" />
          <p className="font-cormorant text-glamDarkBrown">Loading event analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-glamCream to-glamGold/20 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-glamWhite rounded-xl shadow-xl p-8 max-w-md border border-glamGold/20">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="font-cormorant text-2xl font-bold text-glamDarkBrown mb-2">Error Loading Analytics</h2>
            <p className="font-cormorant text-glamDarkBrown/70 mb-6">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold px-6 py-2 rounded-lg transition-colors"
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
      <div className="min-h-screen bg-gradient-to-br from-glamCream to-glamGold/20 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-glamWhite rounded-xl shadow-xl p-8 max-w-md border border-glamGold/20">
            <div className="text-glamGold text-6xl mb-4">📊</div>
            <h2 className="font-cormorant text-2xl font-bold text-glamDarkBrown mb-2">No Analytics Data</h2>
            <p className="font-cormorant text-glamDarkBrown/70 mb-6">No analytics data available for this event.</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-glamGold hover:bg-glamCreamDark text-glamDarkBrown font-cormorant font-semibold px-6 py-2 rounded-lg transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-glamCream to-glamGold/20">
      {/* Header */}
      <div className="bg-glamWhite shadow-sm border-b border-glamGold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 rounded-lg hover:bg-glamGold/10 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-glamDarkBrown" />
              </button>
              <h1 className="font-cormorant text-2xl font-bold text-glamDarkBrown">Event Analytics</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate(`/events/${eventId}`)}
                className="p-2 text-glamDarkBrown/60 hover:text-glamGold hover:bg-glamGold/10 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faEye} className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Info Card */}
        <div className="bg-glamWhite rounded-xl shadow-lg p-6 mb-8 border border-glamGold/20">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="font-cormorant text-3xl font-bold text-glamDarkBrown mb-2">{eventInfo.title}</h2>
              <p className="font-cormorant text-glamDarkBrown/70 mb-4">{eventInfo.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-glamDarkBrown/60">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-glamGold" />
                  {formatDate(eventInfo.date)}
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-glamGold" />
                  {eventInfo.location}
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faTag} className="mr-2 text-glamGold" />
                  {eventInfo.category}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-glamGold mb-1">
                {summaryStats.averageRating}
              </div>
              <div className="flex items-center justify-end mb-2">
                {renderStars(summaryStats.averageRating, 'lg')}
              </div>
              <div className="text-sm text-glamDarkBrown/60">
                {summaryStats.totalFeedbacks} reviews
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-glamWhite rounded-xl shadow-lg p-6 border border-glamGold/20">
            <div className="flex items-center">
              <div className="p-3 bg-glamGold/10 rounded-lg">
                <FontAwesomeIcon icon={faUsers} className="text-glamGold text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-glamDarkBrown/60">Total Reviews</p>
                <p className="text-2xl font-bold text-glamDarkBrown">{summaryStats.totalFeedbacks}</p>
              </div>
            </div>
          </div>

          <div className="bg-glamWhite rounded-xl shadow-lg p-6 border border-glamGold/20">
            <div className="flex items-center">
              <div className="p-3 bg-glamGold/10 rounded-lg">
                <FontAwesomeIcon icon={faStar} className="text-glamGold text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-glamDarkBrown/60">Average Rating</p>
                <p className="text-2xl font-bold text-glamDarkBrown">{summaryStats.averageRating}</p>
              </div>
            </div>
          </div>

          <div className="bg-glamWhite rounded-xl shadow-lg p-6 border border-glamGold/20">
            <div className="flex items-center">
              <div className="p-3 bg-glamGold/10 rounded-lg">
                <FontAwesomeIcon icon={faThumbsUp} className="text-glamGold text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-glamDarkBrown/60">Recommendation</p>
                <p className="text-2xl font-bold text-glamDarkBrown">{summaryStats.recommendationPercentage}%</p>
              </div>
            </div>
          </div>

          <div className="bg-glamWhite rounded-xl shadow-lg p-6 border border-glamGold/20">
            <div className="flex items-center">
              <div className="p-3 bg-glamGold/10 rounded-lg">
                <FontAwesomeIcon icon={faChartBar} className="text-glamGold text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-glamDarkBrown/60">Most Common</p>
                <p className="text-2xl font-bold text-glamDarkBrown">{summaryStats.mostCommonRating.rating} Stars</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-glamWhite rounded-xl shadow-lg p-6 border border-glamGold/20">
            <h3 className="font-cormorant text-xl font-bold text-glamDarkBrown mb-6 flex items-center">
              <FontAwesomeIcon icon={faChartBar} className="mr-3 text-glamGold" />
              Overall Rating Distribution
            </h3>
            <div className="space-y-4">
              {overallRatings.distribution.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-sm font-medium text-glamDarkBrown/70">
                    {item.rating} Star{item.rating > 1 ? 's' : ''}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-glamGold/10 rounded-full h-3">
                      <div 
                        className="bg-glamGold h-3 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-sm text-glamDarkBrown/70 text-right">
                    {item.count} ({item.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-glamWhite rounded-xl shadow-lg p-6 border border-glamGold/20">
            <h3 className="font-cormorant text-xl font-bold text-glamDarkBrown mb-6 flex items-center">
              <FontAwesomeIcon icon={faChartPie} className="mr-3 text-glamGold" />
              Recommendations
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faThumbsUp} className="text-glamGold mr-2" />
                  <span className="text-glamDarkBrown">Would Recommend</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-glamDarkBrown">{recommendations.wouldRecommend}</div>
                  <div className="text-sm text-glamDarkBrown/60">{recommendations.percentage}%</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faThumbsDown} className="text-red-500 mr-2" />
                  <span className="text-glamDarkBrown">Would Not Recommend</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-glamDarkBrown">{recommendations.notRecommend}</div>
                  <div className="text-sm text-glamDarkBrown/60">{100 - recommendations.percentage}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Ratings */}
        <div className="bg-glamWhite rounded-xl shadow-lg p-6 mb-8 border border-glamGold/20">
          <h3 className="font-cormorant text-xl font-bold text-glamDarkBrown mb-6 flex items-center">
            <FontAwesomeIcon icon={faChartBar} className="mr-3 text-glamGold" />
            Detailed Ratings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {detailedRatings.map((category, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-glamGold mb-2">{category.average}</div>
                <div className="text-sm text-glamDarkBrown/70 mb-2">{category.category}</div>
                <div className="flex justify-center mb-2">
                  {renderStars(category.average)}
                </div>
                <div className="text-xs text-glamDarkBrown/50">{category.totalResponses} responses</div>
              </div>
            ))}
          </div>
        </div>

        {/* Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-glamWhite rounded-xl shadow-lg p-6 border border-glamGold/20">
            <h3 className="font-cormorant text-xl font-bold text-glamDarkBrown mb-6 flex items-center">
              <FontAwesomeIcon icon={faUsers} className="mr-3 text-glamGold" />
              Age Groups
            </h3>
            <div className="space-y-3">
              {demographics.ageGroups.map((group, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-glamDarkBrown">{group.ageGroup}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-glamGold/10 rounded-full h-2 mr-3">
                      <div 
                        className="bg-glamGold h-2 rounded-full transition-all duration-500"
                        style={{ width: `${group.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-glamDarkBrown/70 w-12 text-right">
                      {group.count} ({group.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-glamWhite rounded-xl shadow-lg p-6 border border-glamGold/20">
            <h3 className="font-cormorant text-xl font-bold text-glamDarkBrown mb-6 flex items-center">
              <FontAwesomeIcon icon={faChartPie} className="mr-3 text-glamGold" />
              Visitor Type
            </h3>
            <div className="space-y-4">
              {demographics.firstTimeVisitors.pieChartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-glamDarkBrown">{item.label}</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-glamDarkBrown">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Summary */}
        {analytics.reviews && analytics.reviews.totalReviews > 0 && (
          <div className="bg-glamWhite rounded-xl shadow-lg p-6 border border-glamGold/20">
            <h3 className="font-cormorant text-xl font-bold text-glamDarkBrown mb-6 flex items-center">
              <FontAwesomeIcon icon={faChartLine} className="mr-3 text-glamGold" />
              Reviews Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-glamGold mb-2">
                  {analytics.reviews.enjoyedMost.count}
                </div>
                <div className="text-sm text-glamDarkBrown/70">Enjoyed Most</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-glamGold mb-2">
                  {analytics.reviews.improvements.count}
                </div>
                <div className="text-sm text-glamDarkBrown/70">Improvements</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-glamGold mb-2">
                  {analytics.reviews.additional.count}
                </div>
                <div className="text-sm text-glamDarkBrown/70">Additional Comments</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventStats;