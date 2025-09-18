import {Button} from "@/components/ui/button"
import {useState} from "react"
import {useNavigate} from "react-router-dom"
import BookmarkletPage from "@/components/Settings/BookMarklet.tsx";
import {SetupWrapper} from "@/components/Setup/SetupWrapper.tsx";


export const SetupBookmarklet = () => {
  const navigate = useNavigate();
  const [isInstalled, setIsInstalled] = useState(false);

  return (
    <SetupWrapper currentStep={2}>
      <BookmarkletPage onSuccess={() => {
        setIsInstalled(true)
      }}/>

      <>{isInstalled
        ? (<Button className="w-full" onClick={() => navigate('/setup/import')}>Next: Import Bookmarks</Button>)
        : (<Button variant="link" onClick={() => navigate('/setup/import')}>Skip for now</Button>)
      }</>
    </SetupWrapper>
  )
}
