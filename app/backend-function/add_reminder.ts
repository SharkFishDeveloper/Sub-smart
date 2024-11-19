"use server"

import prisma from "@/util/db"


export async function add_reminder({email,taskname,dates}: { email: string; taskname: string; dates: string[] }) {
    try {
        await prisma.reminder.create({
            data: {
              name: taskname,
              dates,
              user: {
                connect: {
                  email:email, // Connect the reminder to the user by their email
                },
              },
            },
          });
          return {message:"Added reminder successfully",status:200}
        } catch (error) {
            console.log(error)
            return {message:"Try again later",status:300}
            
    }
    
}