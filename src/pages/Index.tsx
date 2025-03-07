
import { useState } from "react";
import TabNavigation from "@/components/TabNavigation";
import WorkoutLog from "@/components/WorkoutLog";
import ProfileView from "@/components/ProfileView";
import CommunityView from "@/components/CommunityView";
import Diet from "@/pages/Diet";

const Index = () => {
  const [activeTab, setActiveTab] = useState("workout");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "workout":
        return <WorkoutLog />;
      case "diet":
        return <Diet />;
      case "profile":
        return <ProfileView />;
      case "community":
        return <CommunityView />;
      default:
        return <WorkoutLog />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-['Inter'] antialiased flex flex-col">
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 pb-24">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center">Gym Bro</h1>
        </header>
        <main>{renderActiveTab()}</main>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border py-2">
        <TabNavigation activeTab={activeTab} onChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
