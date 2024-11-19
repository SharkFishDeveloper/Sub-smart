declare module "next-auth" {
    interface Reminder {
      id: number;
      name: string;
      dates: string[];
      userId: string;
    }
  
    interface Session {
      user: {
        id: string;
        email: string;
        name: string;
        reminders?: Reminder[]; // Change `reminder` to `reminders` as it's an array
      };
    }
  }
  