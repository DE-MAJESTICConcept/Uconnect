import React from "react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import Feed from "../Posts/Feed";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar className="bg-gradient-to-b from-[rgb(41,22,112)] via-[rgb(21,79,29)] to-[rgb(196,170,86)] text-white" />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="shadow-md">
          <Navbar
            className="bg-gradient-to-r from-[rgb(41,22,112)] via-[rgb(21,79,29)] to-[rgb(196,170,86)] text-white"
          />
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Feed />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
