"use client";
import { useContext } from "react";
import UserContext from "../../context/UserContext";

const DashboardPage = () => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          {/* Add more user-specific content here */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DashboardPage;
