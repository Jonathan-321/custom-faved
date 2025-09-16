import React, {useState} from 'react';
import {Bookmark, Copy, Feather, GitCompare, Shield} from 'lucide-react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useIsMobile} from "@/hooks/use-mobile.ts";

const BookmarkletPage = () => {
  const [copied, setCopied] = useState(false);
  const bookmarkletRef = React.useRef(null);
  const isMobile = useIsMobile();

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
    const code = generateBookmarkletCode();

    if (isMobile) {
      window.prompt('Copy the bookmarklet code:', code);
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = generateBookmarkletCode();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto font-sans">
      <div className="flex flex-col gap-6 h-full">
        <Card>

          <CardHeader>

            <CardTitle>What is a Bookmarklet?</CardTitle>
            <CardDescription>
              A bookmarklet is a bookmark stored in a web browser that contains JavaScript commands.
              Unlike browser extensions, they are lightweight and only access the page when you click them.
            </CardDescription>
          </CardHeader>
          <CardContent>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <Card className="text-center border-none shadow-none">
                <CardContent className="p-0">
                  <GitCompare className="w-8 h-8 text-primary mx-auto mb-3"/>
                  <h4 className="font-semibold text-primary mb-2">Compatible</h4>
                  <p className="text-sm text-muted-foreground max-w-[190px] mx-auto">Works in all modern desktop and
                    mobile browsers</p>
                </CardContent>
              </Card>

              <Card className="text-center border-none shadow-none">
                <CardContent className="p-0">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-3"/>
                  <h4 className="font-semibold text-primary mb-2">Secure</h4>
                  <p className="text-sm text-muted-foreground max-w-[190px] mx-auto">No access to your page data until
                    activated</p>
                </CardContent>
              </Card>

              <Card className="text-center border-none shadow-none">
                <CardContent className="p-0">
                  <Feather className="w-8 h-8 text-primary mx-auto mb-3"/>
                  <h4 className="font-semibold text-primary mb-2">Lightweight</h4>
                  <p className="text-sm text-muted-foreground max-w-[190px] mx-auto">No browser extension is needed</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className="from-primary to-primary/80 border-1 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">
              Installation
            </CardTitle>

          </CardHeader>
          <CardContent className="space-y-6">

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <a
                className="gap-2 bg-background/20 border-2 border-dashed border-1 hover:bg-background/30 cursor-move w-full sm:w-auto py-1 px-3 flex justify-center items-center rounded-md"
                href='#' ref={bookmarkletRef} draggable="true">
                <Bookmark className="w-4 h-4"/>
                Add to Faved
              </a>
              <Button
                onClick={copyBookmarkletCode}
                className="gap-2 w-full sm:w-auto"
              >
                <Copy className="w-4 h-4"/>
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
            </div>
            <Tabs defaultValue="drag" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="drag">Drag</TabsTrigger>
                <TabsTrigger value="manual">Manual</TabsTrigger>
              </TabsList>
              <TabsContent value="drag" className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-background text-primary">1</Badge>
                    <span>Drag "Add to Faved" button to your browser's bookmarks bar.</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="manual" className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-background text-primary">1</Badge>
                    <span>Click "Copy Code" button above.</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-background text-primary">2</Badge>
                    <span>Add a new bookmark in your browser.</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-background text-primary">3</Badge>
                    <span>Paste the copied code in the "URL" field.</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-background text-primary">4</Badge>
                    <span>Specify a name for the bookmark, for example "Add to Faved".</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-background text-primary">5</Badge>
                    <span>Save the bookmark.</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

          </CardContent>
        </Card>

        <Card className="from-primary to-primary/80 border-1 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">
              Usage
            </CardTitle>

          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-background text-primary">1</Badge>
                <span>Click the "Add to Faved" bookmarklet on any page you’d like to save.</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-background text-primary">2</Badge>
                <span>A window will appear, allowing you to add the page to your bookmarks.</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-background text-primary">3</Badge>
                <span>Optionally, add notes and tags, then click Save.</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-background text-primary">4</Badge>
                <span>The page will be stored and available in Faved.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookmarkletPage;