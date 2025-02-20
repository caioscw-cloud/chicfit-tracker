
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const weightData = [
  { date: "Jan", weight: 70 },
  { date: "Feb", weight: 69 },
  { date: "Mar", weight: 68.5 },
  { date: "Apr", weight: 68 },
  { date: "May", weight: 67.5 },
];

const ProfileView = () => {
  return (
    <div className="animate-fade-up space-y-6 p-4">
      <h2 className="text-2xl font-semibold">Profile</h2>
      
      <div className="grid gap-6">
        <Card className="p-6 bg-card">
          <h3 className="text-lg font-medium mb-4">Weight Progress</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <XAxis
                  dataKey="date"
                  stroke="#A1A1AA"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#A1A1AA"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}kg`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A1A",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#BFA181"
                  strokeWidth={2}
                  dot={{ fill: "#BFA181", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-4 bg-card">
            <h3 className="text-sm text-muted-foreground">Total Workouts</h3>
            <p className="text-2xl font-semibold">24</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </Card>
          <Card className="p-4 bg-card">
            <h3 className="text-sm text-muted-foreground">Avg. Calories</h3>
            <p className="text-2xl font-semibold">2,100</p>
            <p className="text-xs text-muted-foreground">Per day</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
