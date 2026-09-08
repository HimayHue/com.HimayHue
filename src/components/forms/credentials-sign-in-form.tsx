'use client';

import { Input } from '@/components/ui/input';
import { emailSignInSchema } from "@/lib/zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Button } from '../ui/button';
import { CardDescription } from '../ui/card';
import { ROUTES } from '@/lib/constants/routes';



export default function CredentialsSignInForm({
   onSubmitAction,
}: {
   onSubmitAction: (values: z.infer<typeof emailSignInSchema>) => void;
}) {

   const form = useForm<z.infer<typeof emailSignInSchema>>({
      resolver: zodResolver(emailSignInSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });


   return (
      <form id='credentials-form' onSubmit={form.handleSubmit(onSubmitAction)}>

         <FieldGroup>
            <Controller
               name="email"
               control={form.control}
               render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                     <FieldLabel htmlFor="credentials-form-email">
                        Email
                     </FieldLabel>
                     <Input
                        {...field}
                        id="credentials-form-email"
                        aria-invalid={fieldState.invalid}
                        placeholder="user@example.com"
                        autoComplete="on"
                     />
                     {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                     )}
                  </Field>
               )}
            />
            <Controller
               name="password"
               control={form.control}
               render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                     <div className="flex items-center">

                        <FieldLabel htmlFor="credentials-form-password">
                           Password
                        </FieldLabel>
                        <a
                           href={ROUTES.AUTH.FORGOT_PASSWORD}
                           className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                           Forgot your password?
                        </a>
                     </div>

                     <Input
                        {...field}
                        id="credentials-form-password"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="********"
                        autoComplete="on"
                     />
                     {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                     )}
                  </Field>
               )}
            />
            <Button type="submit" form="credentials-form">
               Login
            </Button>
         </FieldGroup>
      </form>
   );
}
