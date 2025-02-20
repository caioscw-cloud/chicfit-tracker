
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Utensils, User } from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  onChange: (value: string) => void;
}

const TabNavigation = ({ activeTab, onChange }: TabNavigationProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onChange} className="w-full">
      <TabsList className="grid grid-cols-3 gap-4 bg-card p-1 rounded-full max-w-md mx-auto">
        <TabsTrigger
          value="workout"
          className="data-[state=active]:bg-workout data-[state=active]:text-black rounded-full transition-all duration-300"
        >
          <Activity className="w-5 h-5" />
          <span className="ml-2 hidden sm:inline">Workout</span>
        </TabsTrigger>
        <TabsTrigger
          value="meal"
          className="data-[state=active]:bg-diet data-[state=active]:text-black rounded-full transition-all duration-300"
        >
          <Utensils className="w-5 h-5" />
          <span className="ml-2 hidden sm:inline">Meal</span>
        </TabsTrigger>
        <TabsTrigger
          value="profile"
          className="data-[state=active]:bg-accent data-[state=active]:text-black rounded-full transition-all duration-300"
        >
          <User className="w-5 h-5" />
          <span className="ml-2 hidden sm:inline">Profile</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TabNavigation;
