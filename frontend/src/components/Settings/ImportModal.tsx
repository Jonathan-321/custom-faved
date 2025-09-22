import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { useContext, useRef, useState } from "react"
import { StoreContext } from "@/store/storeContext"
import { Loader2Icon } from "lucide-react"

export const ImportModal = ({ onSuccess }: { onSuccess?: () => void }) => {
  const store = useContext(StoreContext);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file);
  };

  const submit = async () => {
    const success = await store.importBookmarks(selectedFile, setIsLoading)
    if (success && onSuccess) {
      onSuccess();
    }
  }

  return (
    <Card className="touch-pan-y">
      <CardHeader>
        <CardTitle className="text-lg">Import Bookmarks from Pocket</CardTitle>
        <CardDescription>
          Import your bookmarks from Pocket by uploading your exported ZIP file.
        </CardDescription><CardDescription>
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
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Label htmlFor="zip">Pocket ZIP Archive</Label>
        <Input
          id="zip"
          accept=".zip"
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          disabled={isLoading}
        />
        <p className="text-muted-foreground text-sm"> Select the ZIP file you exported from Pocket.</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={submit} disabled={!selectedFile} type="submit">
          {isLoading && <Loader2Icon className="animate-spin" />}
          Import Bookmarks</Button>
      </CardFooter>
    </Card>
  )
}
