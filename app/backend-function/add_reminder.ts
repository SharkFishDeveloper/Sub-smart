"use server"

import prisma from "@/util/db"


export async function add_reminder({email,taskname,dates,message}: { email: string; taskname: string; dates: string[],message:string }) {
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
              message:message
            },
          });
          return {message:"Added reminder successfully",status:200}
        } catch (error) {
            console.log(error)
            return {message:"Try again later",status:300}
            
    }
    
}