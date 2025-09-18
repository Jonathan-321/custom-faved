import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

import { ImportModal } from "../Settings/ImportModal"
import { SetupWrapper } from "@/components/Setup/SetupWrapper.tsx";


export const SetupImport = (() => {
  const navigate = useNavigate();

  return (
    <SetupWrapper currentStep={3}>
      <ImportModal onSuccess={() => navigate('/')} />

      <Button variant="link" className="" onClick={() => navigate('/')}>Skip for now</Button>
    </SetupWrapper>
  )
})
