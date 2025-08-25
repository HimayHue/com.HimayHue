"use client";

import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
   Home,
   Search,
   List,
   Bell,
   Settings,
} from "lucide-react";



export default function NavBar() {
   const router = useRouter();
   const session = useSession();

   useEffect(() => {
      if (session.status === "unauthenticated") {
         router.push("/api/auth/signin");
      }
   }, [session.status]);

   return (
      <header className="fixed top-0 left-0 h-screen w-60 bg-background shadow-sm">
         <nav className="flex flex-col h-full items-start justify-between ">
            {/* Navigation Links */}
            <div className="flex flex-col gap-4 w-full px-2 pt-4">
               <NavItem href="/home"
                  icon={<Home size={30} strokeWidth={1.5} />}
                  label="Home"
               />
               <NavItem href="search"
                  icon={<Search size={30} strokeWidth={1.5} />}
                  label="Search"
               />
               <NavItem href="/bucketList"
                  icon={<List size={30} strokeWidth={1.5} />}
                  label="Bucket List"
               />
               <NavItem href="/notifcations"
                  icon={<Bell size={30} strokeWidth={1.5} />}
                  label="Notifications"
               />
               <NavItem href="/settings"
                  icon={<Settings size={30} strokeWidth={1.5} />}
                  label="Settings"
               />
            </div>
            {/* Profile Link */}
            <div className="w-full pb-2">
               <NavItem
                  href="/profile"
                  icon={
                     <Image
                        src="/avatar_placeholder.png"
                        alt="User profile picture"
                        width={30}
                        height={30}
                        className="aspect-square rounded-full bg-background object-cover"
                     />
                  }
                  label="Profile"
               />
            </div>
         </nav>
      </header>
   );
}

function NavItem({
   href,
   icon,
   label,
}: {
   href: string;
   icon: React.ReactNode;
   label: string;
   onClick?: () => void;
   asButton?: boolean;
}) {
   const baseClasses =
      "flex items-center gap-3 text-lg font-light text-white px-4 py-2 transition-colors rounded-lg";
   const hoverClasses = "hover:bg-primary hover:text-white";
   const activeClasses = "active:font-bold";


   return (
      <Link
         href={href}
         className={`${baseClasses} ${hoverClasses} ${activeClasses}`}
      >
         {icon}
         {label}
      </Link>
   );
}

function SignInButton() {
   return <Button onClick={() => signIn()}>Sign in</Button>;
}