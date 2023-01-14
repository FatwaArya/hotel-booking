import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  enum Role {
    ADMIN = "admin",
    USER = "user",
    RECEPCIONIST = "receptionist",
  }
  interface Session {
    user?: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    role: Role;
  }
}
