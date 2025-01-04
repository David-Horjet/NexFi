import { DefaultSession, User as DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      wallet?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    wallet?: string;
  }
}
