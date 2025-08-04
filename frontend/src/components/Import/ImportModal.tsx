import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const ImportModal: React.FC<{ isOpen: any, setIsOpen: any }> = ({ isOpen, setIsOpen }) => {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <form>

                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Import Bookmarks from Pocket</DialogTitle>
                        <DialogDescription>
                            Import your bookmarks from Pocket by uploading your exported ZIP file.
                        </DialogDescription>
                        <DialogTitle className="pt-[20px]">Instructions:</DialogTitle>
                        <DialogDescription>
                            <ol className="my-6 ml-4 list-[upper-decimal] [&>li]:mt-2">
                                <li>Export your data from Pocket using their export tool.</li>
                                <li>Upload the resulting ZIP file using the form below.</li>
                                <li>Faved will process all bookmarks, tags, collections and notes.</li>
                                <ul className=" ml-12 list-[circle] [&>li]:mt-2">
                                    <li>Unread and Archived bookmarks will be assigned corresponding tags under "Status" parent tag.</li>
                                    <li>All imported bookmarks will have "Imported from Pocket" tag.</li>
                                    <li>Collections will be imported as tags under "Collections" parent tag.</li>
                                    <li>Collection descriptions will be preserved as tag descriptions.</li>
                                    <li>Collection bookmark notes will be saved as item comments.</li>
                                </ul>
                            </ol>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <div className="grid w-full max-w-sm pb-[20px] items-center gap-3">
                                <Label htmlFor="json">Pocket ZIP Archive</Label>
                                <Input id="json" type="file" />
                                <p className="text-muted-foreground text-sm"> Select the ZIP file you exported from Pocket.</p>
                            </div>
                        </div>

                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant={"default"} type="submit" >Import Bookmarks</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
