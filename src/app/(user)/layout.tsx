import Navbar from "@/components/navbar"
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function UserLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   // Server-side session retrieval just for the authenticated subtree.
   const session = await auth();

   // If no session, you could redirect or render a minimal message.
   // For now we just render the navbar (which will client-side redirect) + children.
   return (
      <SessionProvider session={session}>
         <section>
            <Navbar />
            {children}
         </section>
      </SessionProvider>
   );
}