"use client";
import { useState } from "react";
import { addMonths, addWeeks, format } from "date-fns";
import Link from "next/link";
import { add_reminder } from "./backend-function/add_reminder";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dates: [""],
    periodType: "Month", // Default dropdown value
    periodValue: 1, // Default number of months/weeks
    customDates: [],
  });

  const [reminderDates, setReminderDates] = useState([]);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
// @ts-expect-error: Type error that we intentionally suppress
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
// @ts-expect-error: Type error that we intentionally suppress
  const handleDateChange = (index, value) => {
    if (new Date(value) < new Date()) {
      alert("Date must be in the future.");
      return;
    }
    const updatedDates = [...formData.dates];
    updatedDates[index] = value;
    setFormData((prev) => ({ ...prev, dates: updatedDates }));
  };

  const addDateField = () => {
    setFormData((prev) => ({ ...prev, dates: [...prev.dates, ""] }));
  };
// @ts-expect-error: Type error that we intentionally suppress
  const handleCustomDateChange = (value) => {
    const currentDate = format(new Date(), "yyyy-MM-dd");
    if (formData.customDates.length >= 5) {
      alert("You can add a maximum of 5 custom dates.");
      return;
    }// @ts-expect-error: Type error that we intentionally suppress
    if (value >= currentDate && !formData.customDates.includes(value)) {
      // @ts-expect-error: Type error that we intentionally suppress
      setFormData((prev) => ({
        ...prev,
        customDates: [...prev.customDates, value],
      }));
    } else {
      alert("Date is either invalid or already added.");
    }
  };
// @ts-expect-error: Type error that we intentionally suppress
  const deleteCustomDate = (index) => {
    setFormData((prev) => {
      const updatedCustomDates = [...prev.customDates];
      updatedCustomDates.splice(index, 1);
      return { ...prev, customDates: updatedCustomDates };
    });
  };
// @ts-expect-error: Type error that we intentionally suppress
  const handlePeriodTypeChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, periodType: value }));
    if (value === "Custom") {
      setShowCustomDatePicker(true);
    } else {
      setShowCustomDatePicker(false);
      setFormData((prev) => ({ ...prev, customDates: [] }));
    }
  };

  const calculateReminders = () => {
    const { dates, periodType, periodValue } = formData;

    if (!dates.every((date) => date)) {
      alert("Please fill all the subscription end dates.");
      return;
    }

    const reminders = dates.map((date) => {
      const endDate = new Date(date);
      const reminders = [];
      for (let i = 1; i <= periodValue; i++) {
        const reminderDate =
          periodType === "Month"
            ? addMonths(endDate, -i)
            : addWeeks(endDate, -i);
        reminders.push(format(reminderDate, "yyyy-MM-dd"));
      }
      return reminders;
    });
// @ts-expect-error: Type error that we intentionally suppress
    setReminderDates([...reminders.flat(), ...formData.customDates]);
  };
// @ts-expect-error: Type error that we intentionally suppress
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateReminders();
    console.log("Submitted Reminder:", formData);
  };

  const handleAddingReminder =async ()=>{
    const userId = session.data?.user?.email;
    if(userId){
      const resp = await  add_reminder({
        email: userId,
        taskname: formData.name,
        dates: reminderDates
      });
      if(resp.status!==200){
        alert(resp.message)
      }else{        
        alert(resp.message)
      }
    }else{
      alert("Please sign in")
    }
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">Add a Reminder</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-lg w-full max-w-md space-y-6"
      >
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium">
            Reminder Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium">
            User Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">
            Subscription End Date
          </label>
          {formData.dates.map((date, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="date"
                value={date}
                onChange={(e) => handleDateChange(index, e.target.value)}
                className="flex-grow px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
              {index === formData.dates.length - 1 && (
                <button
                  type="button"
                  onClick={addDateField}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add
                </button>
              )}
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="periodType" className="block text-gray-700 font-medium">
            Period Type
          </label>
          <select
            id="periodType"
            name="periodType"
            value={formData.periodType}
            onChange={handlePeriodTypeChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="Month">Month</option>
            <option value="Week">Week</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        {showCustomDatePicker && (
          <div>
            <label htmlFor="customDates" className="block text-gray-700 font-medium">
              Select Custom Reminder Dates
            </label>
            <input
              type="date"
              id="customDates"
              onChange={(e) => handleCustomDateChange(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
            <div className="mt-2 space-y-2">
              {formData.customDates.map((date, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center px-3 py-2 bg-gray-100 rounded text-sm text-gray-600"
                >
                  {date}
                  <button
                    onClick={() => deleteCustomDate(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="periodValue" className="block text-gray-700 font-medium">
            How Many {formData.periodType}s
          </label>
          <input
            type="number"
            id="periodValue"
            name="periodValue"
            value={formData.periodValue}
            onChange={handleInputChange}
            min="1"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white font-bold rounded hover:bg-green-600"
        >
          Generate Reminders
        </button>
      </form>

      {reminderDates.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded shadow-lg w-full max-w-md">
          <h2 className="text-lg font-bold mb-2 text-blue-600">Generated Reminder Dates:</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {reminderDates.map((date, index) => (
              <li key={index}>{date}</li>
            ))}
          </ul>
        </div>
      )}


   <div className="flex space-x-4 mt-4">
  {reminderDates && reminderDates.length > 0 && (
    <button className="bg-red-500 h-[3rem] w-[8rem] hover:bg-red-700 rounded-md text-xs font-bold text-white transition-all duration-300 ease-in-out transform hover:scale-105" onClick={()=>handleAddingReminder()}>
      Set Reminder
    </button>
  )}

  <button className="bg-blue-500 h-[3rem] w-[10rem] hover:bg-blue-700 rounded-md text-xs font-bold text-white transition-all duration-300 ease-in-out transform hover:scale-105">
    <Link href={"/reminder"}>Show All Reminders</Link>
  </button>
</div>


    </div>
  );
}
