"use client";

import { useState } from "react";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ErrorMessage from "@/components/error-message";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpSchema } from "@/lib/zod";
import { handleCredentialsSignUp } from "@/app/actions/auth-actions";
import CredentialsSignUpForm from "@/components/forms/credentials-signup-form";
import { GoogleSignInButton } from "@/components/signin-buttons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ServerActionResponse {
   success: boolean;
   message: string;
}

export default function SignUp() {
   const [globalError, setGlobalError] = useState("");
   const router = useRouter();

   const form = useForm<z.infer<typeof signUpSchema>>({
      resolver: zodResolver(signUpSchema),
      defaultValues: {
         name: "",
         username: "",
         email: "",
         password: "",
         confirmPassword: "",
      },
   });

   // TODO: turn into a reusable function
   /*
      Function to handle form submission
      This function will be called when the user submits the sign-up form.
      It will validate the input, call the sign-up action, and handle any errors.
   */
   const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
      try {
         console.log("Starting sign-up process...");
         const result: ServerActionResponse = await handleCredentialsSignUp(values);
         if (result.success) {
            console.log("Account created successfully, signing in...");
            // Account created successfully, now sign in the user
            const signInResult = await signIn("credentials", {
               email: values.email,
               password: values.password,
               redirect: false,
            });
            
            console.log("Sign-in result:", signInResult);
            
            if (signInResult?.error) {
               setGlobalError("Account created but login failed. Please try signing in.");
            } else if (signInResult?.ok) {
               // Successful login, redirect to dashboard
               router.push("/dashboard");
            }
         } else {
            setGlobalError(result.message);
         }
      }
      catch (error) {
         setGlobalError("An unexpected error occurred. Please try again.");
         console.error("Error during sign up:", error);
      }
   };

   return (
      <div className="w-full border-none flex flex-col gap-6 py-6 lg:max-w-lg lg:mx-auto">
         <CardHeader>
            <CardTitle>
               Create Account
            </CardTitle>
            <CardDescription>
               Fill in the form below to create a new account
            </CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            {globalError && <ErrorMessage error={globalError} />}
            <CredentialsSignUpForm form={form} onSubmit={onSubmit} />
            <p className="text-center">or</p>
            <GoogleSignInButton />
         </CardContent>
         <CardFooter className="flex flex-col gap-2">
            <p>
               Already have have an account?{" "}
               <a href="/auth/signin" className="text-blue-500 hover:underline">
                  Sign in
               </a>
            </p>
         </CardFooter>
      </div>
   );
}