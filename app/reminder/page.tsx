"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { delete_reminder } from "../backend-function/delete_reminder";

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
  const userData = session?.user as User | undefined; 

  // useState to store reminders
  const [reminders, setReminders] = useState<Reminder[]>(userData?.reminders || []);

  // useEffect to update reminders when userData changes
  useEffect(() => {
    if (userData?.reminders) {
      setReminders(userData.reminders);
    }
  }, [userData?.reminders]);

  const handleDelete = async (id: number) => {
    const userId = session?.user?.email;
    if (userId) {
      const resp = await delete_reminder({ reminderId: id, email: userId });
      alert(resp.message);

      if (resp.status === 200) {
        // Update the state by filtering out the deleted reminder
        setReminders((prevReminders) =>
          prevReminders.filter((reminder) => reminder.id !== id)
        );
      }
    } else {
      alert("Please sign in");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Your Reminders</h1>
      {status === "authenticated" && userData ? (
        <div>
          <h2 className="text-lg font-semibold">Hello, {userData.name}!</h2>
          <p className="text-sm text-gray-600 mb-4">Email: {userData.email}</p>

          {reminders.length > 0 ? (
            <div>
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="border border-gray-300 rounded-md p-4 mb-4 shadow-sm flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-medium">{reminder.name}</h3>
                    <ul className="mt-2 list-disc list-inside text-gray-700">
                      {reminder.dates.map((date, index) => (
                        <li key={index}>{date}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                    onClick={() => handleDelete(reminder.id)}
                  >
                    Delete
                  </button>
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
