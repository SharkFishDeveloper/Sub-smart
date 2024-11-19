"use server";

import prisma from "@/util/db";

export async function add_reminder({
  email,
  taskname,
  dates,
  message,
}: {
  email: string;
  taskname: string;
  dates: string[];
  message: string;
}) {
  try {
    // Check how many reminders the user already has
    const reminderCount = await prisma.reminder.count({
      where: {
        user: {
          email: email,
        },
      },
    });

    // If the user already has 10 reminders, return an error message
    if (reminderCount >= 10) {
      return { message: "Cannot add more than 10 reminders", status: 400 };
    }

    // Add the new reminder
    await prisma.reminder.create({
      data: {
        name: taskname,
        dates,
        user: {
          connect: {
            email: email, // Connect the reminder to the user by their email
          },
        },
        message: message,
      },
    });

    return { message: "Added reminder successfully", status: 200 };
  } catch (error) {
    console.error(error);
    return { message: "Try again later", status: 500 };
  }
}
