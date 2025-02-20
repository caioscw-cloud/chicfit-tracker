
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, ArrowRight } from "lucide-react";

const CommunityView = () => {
  return (
    <div className="animate-fade-up space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Community</h2>

      <Card className="p-6 bg-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Current Challenge</h3>
          <span className="px-3 py-1 bg-workout/10 text-workout rounded-full text-sm">
            Active
          </span>
        </div>
        <p className="text-muted-foreground mb-4">30 Days of Consistency</p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Days Left</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">45</p>
            <p className="text-xs text-muted-foreground">Participants</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">3rd</p>
            <p className="text-xs text-muted-foreground">Your Rank</p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="text-lg font-medium mb-4">Leaderboard</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((position) => (
            <Card key={position} className="p-4 bg-card hover:bg-card-hover transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Trophy className={`w-4 h-4 ${position === 1 ? 'text-yellow-500' : position === 2 ? 'text-gray-300' : 'text-orange-600'}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">User {position}</p>
                  <p className="text-sm text-muted-foreground">24 workouts this month</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">980</p>
                  <p className="text-sm text-muted-foreground">points</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Find Gym Buddies
          </span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Create Challenge
          </span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CommunityView;
