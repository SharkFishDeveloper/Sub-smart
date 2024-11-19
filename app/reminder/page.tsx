"use client";
import { useSession } from "next-auth/react";
import React from "react";

// Define types for the reminder and user
type Reminder = {
  id: number;
  name: string;
  dates: string[];
};

type User = {
  name: string;
  email: string;
  reminders?: Reminder[];
};

const Reminder: React.FC = () => {
  const { data: session, status } = useSession();
  const userData = session?.user as User | undefined; // Explicitly type userData

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Your Reminders</h1>
      {status === "authenticated" && userData ? (
        <div>
          <h2 className="text-lg font-semibold">Hello, {userData.name}!</h2>
          <p className="text-sm text-gray-600 mb-4">Email: {userData.email}</p>

          {userData.reminders && userData.reminders.length > 0 ? (
            <div>
              {userData.reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="border border-gray-300 rounded-md p-4 mb-4 shadow-sm"
                >
                  <h3 className="text-lg font-medium">{reminder.name}</h3>
                  <ul className="mt-2 list-disc list-inside text-gray-700">
                    {reminder.dates.map((date, index) => (
                      <li key={index}>{date}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You have no reminders.</p>
          )}
        </div>
      ) : status === "loading" ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <p className="text-red-500">Please log in to view your reminders.</p>
      )}
    </div>
  );
};

export default Reminder;
