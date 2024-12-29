

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string;
      name?: string;
      image?: string;
      wallet?: string | undefined; // Add wallet property here
    };
  }

  interface User {
    id: string;
    email?: string;
    name?: string;
    image?: string;
    wallet?: string | undefined; // Add wallet property here
  }
}
