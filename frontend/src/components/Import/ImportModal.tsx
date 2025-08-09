import { Button } from "@/components/ui/button"


import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { observer } from "mobx-react-lite"
import { useContext, useEffect, useRef, useState } from "react"
import { StoreContext } from "@/store/storeContext"
import { useNavigate } from "react-router-dom"

export const ImportModal: React.FC = observer(() => {
    const store = useContext(StoreContext);
    // const navigate = useNavigate();
    // useEffect(() => {
    //     if (!store.showLoginPage) navigate('/main', { replace: true });
    // }, [store.showLoginPage])
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setSelectedFile(file);
        setUploadError(null);
    };
    // const handleUpload = async () => {
    //     if (!selectedFile) {
    //         return;
    //     }
    //     setIsUploading(true);
    //     setUploadProgress(0);

    //     try {
    //         const formData = new FormData();
    //         formData.append('zipFile', selectedFile);
    //         console.log('formData', formData)

    //         const response = await fetch('/api/index.php?route=/import/pocket', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: formData,
    //             onUploadProgress: (progressEvent) => {
    //                 const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    //                 setUploadProgress(percentCompleted);
    //             },
    //         });


    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(errorData.message || 'Ошибка загрузки файла.');
    //         }

    //         console.log('Файл успешно загружен:', response);


    //     } catch (error) {
    //         console.error('Ошибка загрузки:', error);
    //         setUploadError((error as Error).message);

    //     } finally {

    //         setIsUploading(false);
    //         setSelectedFile(null);
    //         if (inputRef.current) {
    //             inputRef.current.value = ''; // Очищаем input после загрузки
    //         }
    //     }
    // };
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Import Bookmarks from Pocket</CardTitle>
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
            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <div className="grid w-full max-w-sm pb-[20px] items-center gap-3">
                                <Label htmlFor="zip">Pocket ZIP Archive</Label>
                                <Input
                                    id="zip"
                                    accept=".zip"
                                    type="file"
                                    ref={inputRef}
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                />
                                <p className="text-muted-foreground text-sm"> Select the ZIP file you exported from Pocket.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div className="flex flex-col gap-3">
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <div className="grid w-full max-w-sm pb-[20px] items-center gap-3">
                                <Button onClick={() => { store.importBookmarks(selectedFile) }} variant={"default"} type="submit" >Import Bookmarks</Button>
                            </div>
                        </div>

                    </div>

                </div>
            </CardFooter>
        </Card >
    )
})
