"use client";

import {
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"
import CredentialsSignInForm from "@/components/forms/credentials-signin-form";
import { GoogleSignInButton } from "@/components/signin-buttons";

import { z } from "zod";
import { emailSignInSchema } from "@/lib/zod";
import ErrorMessage from "@/components/error-message";
import { signIn } from "next-auth/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignIn() {
   const params = useSearchParams();
   const error = params.get("error");
   const router = useRouter();

   const [globalError, setGlobalError] = useState<string>("");

   // Handle error from query parameters
   useEffect(() => {
      if (error) {
         switch (error) {
            case "OAuthAccountNotLinked":
               setGlobalError(
                  "Account already exists use your email and password to sign in." // TODO: make this error a variable
               );
               break;
            default:
               setGlobalError(
                  "An unexpected error occurred. Please try again."
               );
         }
      }
      router.replace("/auth/signin");
   }, [error, router]);

   const form = useForm<z.infer<typeof emailSignInSchema>>({
      resolver: zodResolver(emailSignInSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   // TODO: turn into a reusable function
   const onSubmit = async (values: z.infer<typeof emailSignInSchema>) => {
      try {
         console.log("Starting sign-in process...");
         const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
         });

         console.log("Sign-in result:", result);

         if (result?.error) {
            setGlobalError("Invalid credentials");
         } else if (result?.ok) {
            // Successful login, redirect to dashboard
            router.push("/dashboard");
         }
      }
      catch (error) {
         setGlobalError("An unexpected error occurred. Please try again.");
         console.log(`An unexpected error occurred. Please try again. Error: ${error}`);
      }
   };

   return (
      <div className="w-full border-none flex flex-col gap-6 py-6 lg:max-w-lg lg:mx-auto">
         <CardHeader>
            <CardTitle>
               Login to your account
            </CardTitle>
            <CardDescription>
               Enter your email below to login to your account
            </CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            {globalError && <ErrorMessage error={globalError} />}
            <CredentialsSignInForm form={form} onSubmit={onSubmit} />
            <p className="text-center">or</p>
            <GoogleSignInButton />
         </CardContent>
         <CardFooter className="flex flex-col gap-2">
            <p>
               Don&apos;t have an account?{" "}
               <a href="/auth/signup" className="text-blue-500 hover:underline">
                  Sign up
               </a>
            </p>
            <a href="/auth/forgot-password" className="text-blue-500 hover:underline">
               Forgot your password?
            </a>
         </CardFooter>
      </div>
   );
}