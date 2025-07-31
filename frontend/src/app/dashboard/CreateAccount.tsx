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
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  passwordConfirm: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export function CardsCreateAccount() {
  const store = useContext(StoreContext);
  const initialData = {
    name: "",
    password: '',
    passwordConfirm: "",
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
      password: '',
      passwordConfirm: "",
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <CardTitle className="text-2xl">Create an user</CardTitle>
            {/* <CardDescription>
              Enter your Username below to create user
            </CardDescription> */}
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    {/* <Label htmlFor="email-create-account">Username</Label> */}
                    {/* <Input
                id="Username"
                type="username"
                placeholder="Username"
              /> */}
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    {/* <Label htmlFor="email-create-account">Username</Label> */}
                    {/* <Input
                id="Username"
                type="username"
                placeholder="Username"
              /> */}
                    <FormControl>
                      <Input placeholder="Password" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <Label htmlFor="password-create-account">Password</Label>
              <Input id="password-create-account" type="password" /> */}
            </div>
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    {/* <Label htmlFor="email-create-account">Username</Label> */}
                    {/* <Input
                id="Username"
                type="username"
                placeholder="Username"
              /> */}
                    <FormControl>
                      <Input placeholder="Confirm Password" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Create user</Button>
          </CardFooter>
        </form>
      </Form>
    </Card >
  )
}
