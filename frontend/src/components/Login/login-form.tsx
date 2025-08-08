import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { useContext } from "react"
import { StoreContext } from "@/store/storeContext"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
const formSchema = z.object({
  username: z
    .string().min(1, { message: "Username is required" }),
  password: z
    .string().min(1, { message: "Password is required" })
})
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const store = useContext(StoreContext);
  const initialData = {
    username: "",
    password: '',
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
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    store.login(values)
    console.log('values', values)
  }
  return (

    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    {/* <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    /> */}
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
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel>Password</FormLabel>
                          </div>
                          <FormControl>
                            <Input placeholder="Password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button onClick={form.handleSubmit(onSubmit)} type="submit" className="w-full">
                      Login
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </form>
      </Form >
    </div >
  )
}
