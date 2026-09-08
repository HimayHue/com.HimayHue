import { SignInForm } from "@/components/forms/sign-in-form";

type SignInPageProps = {
   searchParams: Promise<{
      error?: string;
   }>;
};

export default async function SignIn({ searchParams }: SignInPageProps) {
   const { error } = await searchParams;

   return (
      <div className="flex gap-6 min-h-svh w-full items-center justify-center p-6 md:p-10">
         <div className="w-full max-w-sm">

            <SignInForm error={error} />
         </div>
      </div>
   );
}