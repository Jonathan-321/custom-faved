import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "../ui/badge"


export function Setup({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className="flex text-left min-h-svh w-full items-center justify-center ">
            <div className="w-[45%]">
                <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Database Setup</CardTitle>

                            {/* <Badge
                                className="flex w-[100%] h-30 bg-red-200 text-left justify-start break-all"
                                variant="secondary"
                            > */}
                            <div className="flex items-center w-[100%] h-15 bg-red-200 text-left justify-start break-all rounded-md">
                                <p className="pl-2 leading-7 [&:not(:first-child)]:mt-6">
                                    Database file not found: /var/www/html/public/../storage/faved.db
                                </p></div>

                            {/* </Badge> */}


                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3">
                                <div className="grid gap-4">
                                    <div className="grid gap-3">
                                        <div className="grid w-full">
                                            <CardTitle className="text-2xl">Welcome to Faved!</CardTitle>
                                            <CardDescription >
                                                Before you can use the application, we need to set up the database.
                                            </CardDescription>
                                            {/* <Badge
                                                className="w-full mt-5 pt-4 flex flex-col w-[100%] items-start h-40 bg-blue-200 text-left justify-start"

                                                variant="secondary"
                                            > */}
                                            <div className="flex items-center flex-col w-[100%]  h-40 bg-blue-200 text-left items-start  justify-start break-all rounded-md">
                                                Note: This will create a database file /storage/faved.db with the following tables:
                                                <ol className="my-6 ml-4 list-[upper-decimal] [&>li]:mt-2">
                                                    <ul className=" ml-12 list-[circle] [&>li]:mt-2">
                                                        <li>items - Stores your bookmarked items</li>
                                                        <li>tags - Stores tags for categorizing items</li>
                                                        <li>items_tags - Connects items with their associated tags.</li>
                                                    </ul>
                                                </ol>
                                            </div>

                                            {/* </Badge> */}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="flex w-full">
                                <Button className="w-[100%]" variant={"default"} type="submit" >Initialize Database</Button>
                            </div>
                        </CardFooter>
                    </Card >
                </div>
            </div>
        </div >
    )
}
