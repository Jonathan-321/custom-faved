"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useContext } from "react"
import { StoreContext } from "@/store/storeContext"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(30, { message: "Username must be at most 30 characters." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  passwordConfirm: z.string().min(8, { message: "Password confirmation must be at least 8 characters." }),
}).refine(
  (data: { password: string; passwordConfirm: string }) => { return data.password === data.passwordConfirm },
  {
    message: "Passwords do not match.",
    path: ["passwordConfirm"],
  }
);


export const CardsCreateAccount: React.FC<{ setIsAuthSuccess: any }> = ({ setIsAuthSuccess }) => {
  const store = useContext(StoreContext);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: '',
      passwordConfirm: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    store.onCreateUser(values, setIsAuthSuccess)
  }
  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <CardTitle className="text-2xl">Create user</CardTitle>
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
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Confirm Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={form.handleSubmit(onSubmit)} className="w-full">Create user</Button>
          </CardFooter>
        </form>
      </Form>
    </Card >
  )
}
