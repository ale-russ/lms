import React, { useContext, useEffect, useState } from "react";

import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Book,
  ChevronLeft,
  ChevronLeftCircle,
  ChevronRight,
  ChevronRightCircle,
  LogOut,
} from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";

const InstructorDashboardPage = () => {
  const { resetCredentials } = useContext(AuthContext);
  const { instructorCourses, setInstructorCourses, fetchCourses } =
    useContext(InstructorContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMenus, setShowMenus] = useState(true);
  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard courses={instructorCourses} />,
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

  const handleToggle = (value) => {
    setShowMenus(value);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="flex  h-full min-h-screen bg-gray-100">
      <div className="py-4">
        <ChevronRight
          className={`h-8 w-8 text-gray-500 rounded-full relative  cursor-pointer ${
            showMenus ? "hidden" : "-left-3"
          } md:hidden`}
          onClick={() => handleToggle(true)}
        />
      </div>
      <aside
        className={`fixed h-full w-64 bg-white shadow-md  transition-transform duration-300 ease-in-out z-40 ${
          showMenus ? "block" : "hidden"
        } md:block md:z-0 `}
      >
        <div>
          <div className="flex items-center justify-between  mb-4 relative">
            <h2 className="text-2xl font-bold p-4">Instructor View</h2>
            <ChevronLeft
              className={`block md:hidden h-8 w-8 text-gray-500 bg-white rounded-full relative -right-3 cursor-pointer`}
              onClick={() => handleToggle(false)}
            />
          </div>
          <nav className="p-4">
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
      <main
        className={`flex-1 p-4 md:p-8 overflow-y-auto 
         
         md:ml-64 transition-margin duration-300 ease-in-out`}
      >
        {/* // className="flex-1 p-4 md:p-8 overflow-y-auto " > */}
        <div className="max-w-7xl md:mx-auto">
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
