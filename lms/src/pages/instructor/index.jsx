import React, { useContext, useEffect, useState } from "react";

import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { BarChart, Book, LogOut } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";

const InstructorDashboardPage = () => {
  const { resetCredentials } = useContext(AuthContext);
  const { instructorCourses, setInstructorCourses, fetchCourses } =
    useContext(InstructorContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses courses={instructorCourses} />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  const handleLogout = () => {
    resetCredentials();
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Instructor View</h2>
          <nav>
            {menuItems.map((item) => (
              <Button
                variant={activeTab === item.value ? "" : "secondary"}
                key={item.value}
                className="w-full justify-start mb-2"
                onClick={
                  item.value === "logout"
                    ? handleLogout
                    : () => setActiveTab(item.value)
                }
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((menu) => (
              <TabsContent value={menu.value} key={menu.value}>
                {menu.component !== null ? menu.component : null}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboardPage;
