
import { useState } from "react";
import TabNavigation from "@/components/TabNavigation";
import WorkoutLog from "@/components/WorkoutLog";
import MealLog from "@/components/MealLog";
import ProfileView from "@/components/ProfileView";

const Index = () => {
  const [activeTab, setActiveTab] = useState("workout");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "workout":
        return <WorkoutLog />;
      case "meal":
        return <MealLog />;
      case "profile":
        return <ProfileView />;
      default:
        return <WorkoutLog />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-['Inter'] antialiased flex flex-col">
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 pb-24">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center">ChicFit</h1>
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
