import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import nacl from "tweetnacl";
import bs58 from "bs58";

console.log("NextAuth API route loaded");

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Solana Wallet",
      credentials: {
        walletAddress: { label: "Wallet Address", type: "text" },
        signature: { label: "Signature", type: "text" },
        message: { label: "Message", type: "text" },
      },
      authorize: async (credentials: any) => {
        try {
          const { walletAddress, signature, message } = credentials;

          // Verify the signature using nacl
          const isValid = nacl.sign.detached.verify(
            new TextEncoder().encode(message),
            bs58.decode(signature),
            bs58.decode(walletAddress)
          );

          if (isValid) {
            // If valid, return the user object
            return { id: walletAddress, name: `User-${walletAddress}`, wallet: walletAddress };
          }

          return null; // Invalid signature
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.wallet = user.wallet; // Add wallet address to the token
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.wallet && typeof token.wallet === "string") {
        session.user.wallet = token.wallet; // Add wallet address to the session
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST}
