"use client"

import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectSeparator,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, UseFormRegister, FieldErrors, Path, Controller } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
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
   FieldContent,
   FieldDescription,
   FieldError,
   FieldGroup,
   FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group"
import {
   propertyFormSchema as formSchema,
   propertyTypeEnum,
   PropertyFormInput,
} from "@/lib/zod/properties"
import type { CreatePropertyResult } from "@/actions/properties"


/**
 * Reusable form input field component that integrates with react-hook-form and displays validation errors.
 * @param label - The label for the input field.
 * @param name - The name of the field, which should match the form data structure.
 * @param register - The register function from react-hook-form.
 * @param errors - The errors object from react-hook-form's formState.
 * @param type - The type of the input field. Can be any valid HTML input type (default is "text").
 * @param placeholder - The placeholder text for the input field (optional).
 * @param className - Additional CSS classes for styling the field (optional).
 */
function FormInputField({
   label,
   name,
   register,
   errors,
   type = "text",
   step,
   placeholder,
   className,
}: {
   label: string
   name: Path<PropertyFormInput>
   register: UseFormRegister<PropertyFormInput>
   errors: FieldErrors<PropertyFormInput>
   type?: string
   step?: string
   placeholder?: string
   className?: string
}) {
   const error = errors[name]
   const isInvalid = Boolean(error)

   return (
      <Field data-invalid={isInvalid} className={className}>
         <FieldLabel htmlFor={name}>{label}</FieldLabel>
         <Input
            {...register(name)}
            id={name}
            type={type}
            step={step}
            placeholder={placeholder}
            aria-invalid={isInvalid}
         />
         {isInvalid && <FieldError errors={[error]} />}
      </Field>
   )
}

export function AddPropertyForm({
   onSubmitAction,
}: {
   onSubmitAction?: (
      values: z.infer<typeof formSchema>
   ) => Promise<CreatePropertyResult>
}) {


   // Initialize the form with react hook form and zod validation
   const form = useForm<PropertyFormInput>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: "",
         description: "",
         propertyType: undefined,
         url: "",
         coverImage: "",
         price: "",
         propertyTax: "",
         hoaFees: "",
         bedrooms: "",
         bathrooms: "",
         squareFootage: "",
         lotSize: "",
         yearBuilt: "",
         address: "",
         city: "",
         state: "",
         zipCode: "",
         latitude: "",
         longitude: "",
      },
   })


   const { register, formState: { errors, isSubmitting }, handleSubmit, reset } = form


   async function onSubmit(data: any) {
      const validatedData = data as z.infer<typeof formSchema>

      if (onSubmitAction) {
         try {
            const result = await onSubmitAction(validatedData)

            if (!result.success) {
               toast.error(result.message)
               return
            }

            toast.success(result.message)
            reset()
         } catch (error) {
            console.error("Unexpected property creation error:", error)
            toast.error("Failed to create property. Please try again.")
         }
         return
      }

      toast("Property Details Captured", {
         description: (
            <pre className="mt-2 w-[320px] max-h-60 overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
               <code>{JSON.stringify(validatedData, null, 2)}</code>
            </pre>
         ),
         position: "bottom-right",
      })
   }

   return (
      <Card className="w-full max-w-3xl mx-auto">

         <CardHeader>
            <CardTitle>Add Property</CardTitle>
            <CardDescription>
               Enter the financial and architectural details to evaluate this property.
            </CardDescription>
         </CardHeader>

         <CardContent>
            <form id="add-property-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
               {/* Basic Information */}
               <section>
                  <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-4">
                     Basic Information
                  </h3>
                  <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormInputField label="Property Name" name="name" register={register} errors={errors} placeholder="e.g. Sunset Modern Ranch" />

                     <Controller
                        name="propertyType"
                        control={form.control}
                        render={({ field, fieldState }) => (
                           <Field data-invalid={fieldState.invalid}>
                              <FieldContent>
                                 <FieldLabel htmlFor="propertyType">Property Type</FieldLabel>
                                 {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </FieldContent>

                              <Select
                                 value={field.value ?? ""}
                                 onValueChange={field.onChange}
                                 onOpenChange={(open) => {
                                    if (!open) field.onBlur()
                                 }}
                              >
                                 <SelectTrigger
                                    id="propertyType"
                                    aria-invalid={fieldState.invalid}
                                    className="min-w-[120px]"
                                 >
                                    <SelectValue placeholder="Select a property type" />
                                 </SelectTrigger>

                                 <SelectContent position="item-aligned">

                                    {propertyTypeEnum.options.map((propertyType) => (
                                       <SelectItem key={propertyType} value={propertyType}>
                                          {propertyType.charAt(0) + propertyType.slice(1).toLowerCase()}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           </Field>
                        )}
                     />

                     <FormInputField label="Listing URL" name="url" type="url" register={register} errors={errors} placeholder="https://zillow.com/..." />
                     <FormInputField label="Cover Image URL" name="coverImage" type="url" register={register} errors={errors} placeholder="https://images.unsplash.com/..." />

                     <Field data-invalid={Boolean(errors.description)} className="md:col-span-2">
                        <FieldLabel htmlFor="description">Description</FieldLabel>
                        <InputGroup>
                           <InputGroupTextarea
                              {...register("description")}
                              id="description"
                              placeholder="Key features, neighborhood vibe, or renovation notes..."
                              rows={4}
                              className="min-h-20 resize-none"
                              aria-invalid={Boolean(errors.description)}
                           />
                        </InputGroup>
                        {errors.description && <FieldError errors={[errors.description]} />}
                     </Field>
                  </FieldGroup>
               </section>

               {/* Financials */}
               <section>
                  <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-4">
                     Financials
                  </h3>
                  <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <FormInputField label="Price ($)" name="price" type="number" register={register} errors={errors} placeholder="450000" />
                     <FormInputField label="Annual Tax ($)" name="propertyTax" type="number" register={register} errors={errors} placeholder="3200" />
                     <FormInputField label="Monthly HOA ($)" name="hoaFees" type="number" register={register} errors={errors} placeholder="150" />
                  </FieldGroup>
               </section>

               {/* Physical Specs & Dimensions */}
               <section>
                  <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-4">
                     Specs & Dimensions
                  </h3>
                  <FieldGroup className="grid grid-cols-2 md:grid-cols-5 gap-4">
                     <FormInputField label="Bedrooms" name="bedrooms" type="number" register={register} errors={errors} placeholder="3" />
                     <FormInputField label="Bathrooms" name="bathrooms" type="number" step="0.5" register={register} errors={errors} placeholder="2" />
                     <FormInputField label="Sq. Footage" name="squareFootage" type="number" register={register} errors={errors} placeholder="1850" />
                     <FormInputField label="Lot Size (sqft)" name="lotSize" type="number" register={register} errors={errors} placeholder="6500" />
                     <FormInputField label="Year Built" name="yearBuilt" type="number" register={register} errors={errors} placeholder="2012" className="col-span-2 md:col-span-1" />
                  </FieldGroup>
               </section>

               {/* Location */}
               <section>
                  <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-4">
                     Location
                  </h3>
                  <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <FormInputField label="Street Address" name="address" register={register} errors={errors} placeholder="1234 E University Dr" className="md:col-span-3" />
                     <FormInputField label="City *" name="city" register={register} errors={errors} placeholder="Tempe" />
                     <FormInputField label="State *" name="state" register={register} errors={errors} placeholder="AZ" />
                     <FormInputField label="ZIP Code *" name="zipCode" register={register} errors={errors} placeholder="85281" />
                     <FormInputField label="Latitude" name="latitude" type="number" register={register} errors={errors} placeholder="33.4255" />
                     <FormInputField label="Longitude" name="longitude" type="number" register={register} errors={errors} placeholder="-111.9400" />
                  </FieldGroup>
               </section>
            </form>
         </CardContent>

         <CardFooter className="flex justify-end gap-3 pt-6 border-t">
            <Button className="hover:cursor-pointer" type="button" variant="outline" onClick={() => reset()} disabled={isSubmitting}>
               Reset
            </Button>
            <Button className="hover:cursor-pointer" type="submit" form="add-property-form" disabled={isSubmitting}>
               {isSubmitting ? "Saving..." : "Add Property"}
            </Button>
         </CardFooter>

      </Card>
   )
}