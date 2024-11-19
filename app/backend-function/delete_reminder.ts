"use server"

import prisma from "@/util/db";



export async function delete_reminder({reminderId,email}:{reminderId:number,email:string}) {
    try {
          await prisma.reminder.delete({
            where: { id: reminderId ,userId:email},
          });
        return { message: "Deleted reminder successfully", status: 200 };
    } catch (error) {
        console.log(error);
        return { message: "Try again later", status: 500 };
    }
}