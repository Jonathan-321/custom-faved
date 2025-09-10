import React, { useState } from 'react';
import { Bookmark, Zap, Shield, GitCompare, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BookmarkletPage = () => {
    const [copied, setCopied] = useState(false);
    const bookmarkletRef = React.useRef(null);

    React.useEffect(() => {
        const bookmarkletElement = bookmarkletRef.current;
        if (bookmarkletElement) {
            bookmarkletElement.setAttribute('href', generateBookmarkletCode());
        }
    });

    const bookmarkletFunction = () => {
        const urlParams = new URLSearchParams();
        urlParams.append('url', window.location.href);
        urlParams.append('title', document.title);

        const meta_description = document.querySelector('meta[name="description"]');
        if (meta_description) {
            urlParams.append('description', meta_description.getAttribute('content') || '');
        }

        const windowWidth = 700;
        const windowHeight = 700;
        const leftPos = Math.floor((screen.width - windowWidth) / 2);
        const topPos = Math.floor((screen.height - windowHeight) / 2);
        const windowProps = {
            width: 700,
            height: 700,
            left: leftPos.toString(),
            top: topPos.toString(),
            resizable: 'yes',
            scrollbars: 'yes',
            status: 'false',
            location: 'false',
            toolbar: 'false',
        };

        window.open(
            `<<BASE_PATH>>?${urlParams.toString()}`,
            "add-to-faved",
            Object.entries(windowProps).map(([key, value]) => key + "=" + value).join(",")
        );
    }

    const generateBookmarkletCode = () => {
        const basePath = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '') + '/create-item';
        return `javascript:(${bookmarkletFunction})();`.replace("<<BASE_PATH>>", basePath);
    };

    const copyBookmarkletCode = async () => {
        try {
            await navigator.clipboard.writeText(generateBookmarkletCode());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = generateBookmarkletCode();
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="min-h-screen w-full max-w-4xl mx-auto font-sans">
            <div className="flex flex-col gap-6 h-full">
                <Card className="from-primary to-primary/80 border-1 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl md:text-2xl">
                            Faved Bookmarklet
                        </CardTitle>
                        <CardDescription>
                            Quickly save any page to your Faved bookmarks catalog
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <a className="gap-2 bg-background/20 border-2 border-dashed border-1 hover:bg-background/30 cursor-move w-full sm:w-auto py-1 px-3 flex justify-center items-center rounded-md"
                                href='#' ref={bookmarkletRef} draggable="true">
                                <Bookmark className="w-4 h-4" />
                                Add to Faved
                            </a>
                            <Button
                                onClick={copyBookmarkletCode}
                                className="gap-2 w-full sm:w-auto"
                            >
                                <Copy className="w-4 h-4" />
                                {copied ? 'Copied!' : 'Copy Code'}
                            </Button>
                        </div>
                        <Tabs defaultValue="drag" className="w-full">
                            <TabsList className="grid grid-cols-2 w-full">
                                <TabsTrigger value="drag">Drag</TabsTrigger>
                                <TabsTrigger value="manual">Manual</TabsTrigger>
                            </TabsList>
                            <TabsContent value="drag" className="space-y-4 pt-4">
                                <div className="flex items-start gap-4">
                                    <Badge variant="secondary" className="text-lg px-3 py-2">1</Badge>
                                    <div>
                                        <p className="font-semibold">Drag to bookmarks bar</p>
                                        <p className="text-sm opacity-90">Simply drag this button to your browser's bookmarks bar</p>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="manual" className="space-y-4 pt-4">
                                <div className="flex items-start gap-4">
                                    <Badge variant="secondary" className="text-lg px-3 py-2">1</Badge>
                                    <div>
                                        <p className="font-semibold">Manual installation</p>
                                        <p className="text-sm opacity-90">Click "Copy Code" and paste manually when creating a bookmark</p>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="bg-background text-primary">2</Badge>
                                <span>Click the bookmarklet on any page you want to save</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="bg-background text-primary">3</Badge>
                                <span>A window will open to add the page to your bookmarks</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Alert variant="default" className="bg-muted">
                    <AlertTitle>What is a Bookmarklet?</AlertTitle>
                    <AlertDescription className="text-muted-foreground">
                        A bookmarklet is a bookmark stored in a web browser that contains JavaScript commands.
                        Unlike browser extensions, they are lightweight and only access the page when you click them.
                    </AlertDescription>
                </Alert>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold text-primary mb-2">Fast</h4>
                            <p className="text-sm text-muted-foreground">Instant saving without opening separate apps</p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold text-primary mb-2">Secure</h4>
                            <p className="text-sm text-muted-foreground">No access to your data until activated</p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <GitCompare className="w-8 h-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold text-primary mb-2">Compatible</h4>
                            <p className="text-sm text-muted-foreground">Works in all modern browsers</p>
                        </CardContent>
                    </Card>

                </div>
                <Card className="bg-gray-50 border-1">
                    <CardHeader>
                        <CardTitle className="text-black-800 text-lg">Manual Installation Guide</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="text-black-700 space-y-2 text-sm list-decimal list-inside pl-4">
                            <li>Click "Copy Code" button above</li>
                            <li>Open your browser's bookmark manager (Ctrl+Shift+O)</li>
                            <li>Add a new bookmark</li>
                            <li>Paste the copied code in the "URL" field</li>
                            <li>Name it "Add to Faved"</li>
                            <li>Save the bookmark</li>
                        </ol>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default BookmarkletPage;