import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Clock, Plus, Star, Sun } from 'lucide-react';

interface ChatHistory {
  title: string;
  daysAgo: number;
}

export default function Dashboard() {
  const chatHistory: ChatHistory[] = [
    { title: 'Passing Clerk Authentication from...', daysAgo: 1 },
    { title: 'Memo Generator App with React and...', daysAgo: 2 },
    { title: 'Accessing Clerk Auth User in Node.js Express', daysAgo: 4 },
    { title: 'Enhancing a Segment Loader UI Component', daysAgo: 6 },
    { title: 'Enhancing Customer Report Viewer with UR...', daysAgo: 6 },
    { title: 'Scraping Reddit Comments with...', daysAgo: 6 },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Limited Plan Banner */}
      <div className="bg-indigo-50 rounded-lg p-3 flex items-center justify-center gap-3">
        <div className="flex items-center gap-2 text-sm text-indigo-700">
          <Star size={16} className="text-indigo-500" />
          <span>You're on the free plan - Unlock all features</span>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Upgrade Now</Button>
      </div>

      {/* Greeting Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Sun className="text-amber-400" size={32} />
          <h1 className="text-3xl font-semibold text-gray-900">Welcome to Segment Genie</h1>
        </div>
        <p className="text-gray-600 ml-11">Your AI-powered market research assistant</p>
      </div>

      <Card className="shadow-md border-2 border-gray-100 hover:border-indigo-100 transition-colors">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-gray-900">What idea do you want to validate today?</h2>
            <div className="space-y-4">
              <Textarea
                placeholder="Describe your business idea or target audience in detail... For example: I want to create a mobile app that helps pet owners find and book pet sitters in their local area. The app would include features like reviews, scheduling, and secure payments."
                // className="min-h-[160px] resize-none p-4 text-base"
                className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
              <div className="flex justify-end">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6">
                  Analyze
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Segments Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-gray-400" />
            <h2 className="text-xl font-medium text-gray-900">Recent Segments</h2>
          </div>
          <Button variant="ghost" className="text-gray-600 hover:text-indigo-600">
            View all segments
            <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-indigo-50 border-2 border-dashed border-indigo-200 hover:border-indigo-300 cursor-pointer transition-colors">
            <CardHeader className="flex items-center justify-center h-32">
              <div className="text-center space-y-2">
                <Plus size={24} className="mx-auto text-indigo-500" />
                <p className="text-sm font-medium text-indigo-600">Create new segment</p>
              </div>
            </CardHeader>
          </Card>

          {chatHistory.map((chat, index) => (
            <Card
              key={index}
              className="hover:shadow-md transition-shadow border-2 border-transparent hover:border-indigo-100 cursor-pointer"
            >
              <CardHeader>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 line-clamp-2">{chat.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock size={14} />
                    {chat.daysAgo} {chat.daysAgo === 1 ? 'day' : 'days'} ago
                  </p>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
