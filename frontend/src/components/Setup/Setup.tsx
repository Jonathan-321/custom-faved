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
import { observer } from "mobx-react-lite"
import { useContext } from "react"
import { StoreContext } from "@/store/storeContext"
import { Navigate } from "react-router-dom"



export const Setup = observer(({ className, ...props }: React.ComponentProps<"div">) => {
    const store = useContext(StoreContext);

    if (!store.showInitializeDatabasePage) {
        return <Navigate to="/" replace />;
    }

    return (
        // <div className="flex text-left min-h-svh w-full items-center justify-center ">
        //     <div className="w-[45%]">
        //         <div className={cn("flex flex-col gap-6", className)} {...props}>
        //             <Card>
        //                 <CardHeader>
        //                     <CardTitle className="text-2xl">Database Setup</CardTitle>
        //                     <div className="flex items-center w-[100%] h-15 bg-red-200 dark:bg-red-500 text-left justify-start break-all rounded-md">
        //                         <p className="pl-2 leading-7 [&:not(:first-child)]:mt-6">
        //                             Database file not found: /var/www/html/public/../storage/faved.db
        //                         </p></div>
        //                 </CardHeader>
        //                 <CardContent className="flex flex-col gap-4">
        //                     <div className="flex flex-col gap-3">
        //                         <div className="grid gap-4">
        //                             <div className="grid gap-3">
        //                                 <div className="grid w-full">
        //                                     <CardTitle className="text-2xl">Welcome to Faved!</CardTitle>
        //                                     <CardDescription >
        //                                         Before you can use the application, we need to set up the database.
        //                                     </CardDescription>
        //                                     <div className="flex items-center flex-col w-[100%] dark:bg-blue-500  h-40 bg-blue-200 text-left items-start  justify-start break-all rounded-md">
        //                                         Note: This will create a database file /storage/faved.db with the following tables:
        //                                         <ol className="my-6 ml-4 list-[upper-decimal] [&>li]:mt-2">
        //                                             <ul className=" ml-12 list-[circle] [&>li]:mt-2">
        //                                                 <li>items - Stores your bookmarked items</li>
        //                                                 <li>tags - Stores tags for categorizing items</li>
        //                                                 <li>items_tags - Connects items with their associated tags.</li>
        //                                             </ul>
        //                                         </ol>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </CardContent>
        //                 <CardFooter>
        //                     <div className="flex w-full">
        //                         <Button onClick={() => { store.initialDatabase() }} className="w-[100%]" variant={"default"} type="submit" >Initialize Database</Button>
        //                     </div>
        //                 </CardFooter>
        //             </Card >
        //         </div>
        //     </div>
        <div className="flex text-left min-h-svh w-full items-center justify-center ">


            <Card className="container mx-auto lg:w-1/2 m-3 border border-gray-300 rounded-lg shadow-md">
                <CardHeader> <h2 className="text-2xl font-semibold mb-4"><CardTitle>Database Setup</CardTitle></h2>

                    <div className="bg-red-100  dark:bg-red-400 dark:text-white text-red-700 p-4 rounded-lg mb-4">
                        Database not found. Please set up the database first.
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <p className="mb-2"><strong>Welcome to Faved!</strong></p>

                    <p className="mb-4">Before you can use the application, we need to set up the database.</p>

                    <div className="bg-blue-100 p-4 rounded-lg mb-4  dark:bg-blue-600">
                        <p className="italic mb-2"><strong>Note:</strong> This will create a database file <code>/storage/faved.db</code> with the following tables:</p>
                        <ul className="list-disc pl-6">
                            <li><code>items</code> - Stores your bookmarked items</li>
                            <li><code>tags</code> - Stores tags for categorizing items</li>
                            <li><code>items_tags</code> - Connects items with their associated tags</li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant={"secondary"} className="bg-black hover:bg-black text-white font-bold py-2 px-4 rounded w-full" onClick={() => { store.initialDatabase() }}>
                        Initialize Database
                    </Button>
                </CardFooter>
            </Card>

        </div >
    )
})
