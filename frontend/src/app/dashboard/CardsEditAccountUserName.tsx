"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import styles from "./dashboard.module.scss"
import { useContext, useEffect } from "react"
import { StoreContext } from "@/store/storeContext"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"


const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(30, { message: "Username must be at most 30 characters." }),
})

export function CardsEditAccountUserName() {
  const store = useContext(StoreContext);
  const initialData = {
    username: "",

  }
  const defaultValues = initialData;
  // const { reset, register, handleSubmit, formState: { errors }, control } = useForm<z.infer<typeof formSchema>>({
  //   defaultValues: defaultValues,
  //   resolver: zodResolver(formSchema)
  // });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })
  // useEffect(() => {
  //   reset(defaultValues)
  // }, [])
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <Card className={styles.cardWrapper}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardHeader>
            <CardTitle className="text-2xl">New Username</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={form.handleSubmit(onSubmit)} className="w-full">Update Username</Button>
          </CardFooter>
        </form>
      </Form>
    </Card >
  )
}
