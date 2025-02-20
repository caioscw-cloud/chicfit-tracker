
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
    <div className="min-h-screen bg-background text-foreground font-['Inter'] antialiased">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-8">ChicFit</h1>
          <TabNavigation activeTab={activeTab} onChange={setActiveTab} />
        </header>
        <main className="mt-8">{renderActiveTab()}</main>
      </div>
    </div>
  );
};

export default Index;
