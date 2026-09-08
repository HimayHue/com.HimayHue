"use client"
import { cn } from "cn"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { useEffect, useState } from "react"
import ErrorMessage from "../error-message"
import { GoogleSignInButton } from "../buttons/sign-in-buttons"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/constants/routes"
import CredentialsSignInForm from "./credentials-sign-in-form"
import { signIn } from "next-auth/react";

import { z } from "zod";
import { emailSignInSchema } from "@/lib/zod";

function getSignInErrorMessage(error?: string) {
  switch (error) {
    case "CredentialsSignin":
      return "Invalid email or password.";
    case "OAuthAccountNotLinked":
      return "An account already exists with this email. Sign in with your email and password.";
    case "AccessDenied":
      return "Access was denied. Please try again.";
    case "Verification":
      return "Your sign-in link is invalid or has expired.";
    case "Configuration":
    case "OAuthCallbackError":
    case "CallbackRouteError":
      return "Sign-in is temporarily unavailable. Please try again later.";
    default:
      return error ? "Unable to sign in. Please try again." : "";
  }
}


/**
 * 
 */
export function SignInForm({
  className,
  error,
}: {
  className?: string;
  error?: string;
}) {
  const router = useRouter()
  const [globalError, setGlobalError] = useState<string>("");

  const submitCredentialsAction = async (values: z.infer<typeof emailSignInSchema>) => {
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });


      if (result?.error) {
        setGlobalError(getSignInErrorMessage(result.error));
      } else if (result?.ok) {
        router.push("/dashboard");
      } else {
        setGlobalError("Unable to sign in. Please try again.");
      }
    }
    catch (error) {
      setGlobalError("An unexpected error occurred. Please try again.");
      console.error("Sign-in failed:", error);
    }
  };

  useEffect(() => {
    if (error) {
      setGlobalError(getSignInErrorMessage(error));
      router.replace("/auth/signin");
    }
  }, [error, router]);


  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="w-full max-w-sm">

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
          <CredentialsSignInForm onSubmitAction={submitCredentialsAction} />
          <GoogleSignInButton />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <FieldDescription className="text-center">
            Don&apos;t have an account? <a href={ROUTES.AUTH.SIGN_UP}>Sign up</a>
          </FieldDescription>
        </CardFooter>
      </Card>
    </div>
  )
}
