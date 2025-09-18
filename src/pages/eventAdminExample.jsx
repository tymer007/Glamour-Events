import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Badge } from "./components/ui/badge";
import { Copy, Plus, Eye, Star, Users, Calendar, MessageSquare, TrendingUp } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ToastProvider } from "./components/ToastProvider";
import { QuickActions } from "./components/QuickActions";
import exampleImage from 'figma:asset/724d290ecda46f2898b4d29f4a7909378eda1bb5.png';

export default function App() {
  // Mock data for the dashboard
  const kpis = {
    totalUsers: 1247,
    upcomingEvents: 12,
    pastEvents: 48,
    averageRating: 4.7,
    totalReviews: 342
  };

  const upcomingEvents = [
    {
      id: 1,
      name: "Spring Gala 2025",
      date: "2025-04-15",
      reviewsCount: 23,
      link: "https://glamour-events.com/event/spring-gala-2025"
    },
    {
      id: 2,
      name: "Corporate Awards Night",
      date: "2025-04-22",
      reviewsCount: 18,
      link: "https://glamour-events.com/event/corporate-awards-2025"
    },
    {
      id: 3,
      name: "Wedding Showcase",
      date: "2025-05-03",
      reviewsCount: 31,
      link: "https://glamour-events.com/event/wedding-showcase-may"
    },
    {
      id: 4,
      name: "Charity Fundraiser",
      date: "2025-05-10",
      reviewsCount: 12,
      link: "https://glamour-events.com/event/charity-fundraiser-2025"
    }
  ];

  const pastEvents = [
    {
      name: "Valentine's Romance Evening",
      rating: 4.9,
      totalReviews: 67,
      recommendationRate: 96
    },
    {
      name: "Winter Wonderland Ball",
      rating: 4.8,
      totalReviews: 54,
      recommendationRate: 94
    },
    {
      name: "New Year's Eve Celebration",
      rating: 4.6,
      totalReviews: 89,
      recommendationRate: 91
    },
    {
      name: "Holiday Corporate Party",
      rating: 4.7,
      totalReviews: 43,
      recommendationRate: 93
    },
    {
      name: "Autumn Harvest Festival",
      rating: 4.5,
      totalReviews: 38,
      recommendationRate: 88
    }
  ];

  const copyEventLink = (link: string, eventName: string) => {
    navigator.clipboard.writeText(link);
    toast(`Event link copied for ${eventName}!`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <ToastProvider />
      <div className="min-h-screen" style={{ backgroundColor: '#f5f2ed' }}>
      {/* Header with Branding */}
      <div className="bg-white shadow-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={exampleImage} 
                alt="Glamour Events" 
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Event Center Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create New Event
              </Button>
              <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50">
                <Eye className="h-4 w-4 mr-2" />
                View All Events
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-amber-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Users Registered</CardTitle>
              <Users className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{kpis.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-amber-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{kpis.upcomingEvents + kpis.pastEvents}</div>
              <p className="text-xs text-gray-600 mt-1">
                {kpis.upcomingEvents} upcoming • {kpis.pastEvents} past
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-amber-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Average Event Rating</CardTitle>
              <Star className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 flex items-center">
                {kpis.averageRating}
                <Star className="h-5 w-5 text-amber-400 fill-current ml-1" />
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.2 from last quarter
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-amber-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Reviews Submitted</CardTitle>
              <MessageSquare className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{kpis.totalReviews}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18 this week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Events Table */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-amber-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-amber-100">
                      <TableHead className="text-gray-700">Event Name</TableHead>
                      <TableHead className="text-gray-700">Date</TableHead>
                      <TableHead className="text-gray-700">Reviews</TableHead>
                      <TableHead className="text-gray-700">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingEvents.map((event) => (
                      <TableRow key={event.id} className="border-amber-50">
                        <TableCell className="font-medium text-gray-900">{event.name}</TableCell>
                        <TableCell className="text-gray-600">{formatDate(event.date)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            {event.reviewsCount} reviews
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyEventLink(event.link, event.name)}
                            className="text-amber-700 hover:text-amber-800 hover:bg-amber-50"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Past Events Quick Stats */}
            <Card className="bg-white border-amber-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Recent Past Events</CardTitle>
                <p className="text-sm text-gray-600">Last 5 completed events</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {pastEvents.map((event, index) => (
                  <div key={index} className="border-b border-amber-50 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-medium text-gray-900 mb-2">{event.name}</h4>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Rating:</span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-amber-400 fill-current mr-1" />
                          <span className="font-medium text-gray-900">{event.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Reviews:</span>
                        <span className="font-medium text-gray-900">{event.totalReviews}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Recommendation:</span>
                        <span className="font-medium text-green-700">{event.recommendationRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}