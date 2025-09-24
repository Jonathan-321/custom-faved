import {Button} from "@/components/ui/button"
import {observer} from "mobx-react-lite"
import {useContext} from "react"
import {StoreContext} from "@/store/storeContext"
import {Navigate, useNavigate} from "react-router-dom"

import {CardsCreateAccount} from "@/components/dashboard/CreateAccount"
import {SetupWrapper} from "@/components/Setup/SetupWrapper.tsx";

export const SetupAuth = observer(() => {
  const store = useContext(StoreContext);
  const navigate = useNavigate();
  const nextStep = '/setup/bookmarklet'

  if (store.user) {
    return <Navigate to={nextStep} replace={true}/>
  }

  return (
    <SetupWrapper currentStep={1}>
      <CardsCreateAccount onSuccess={() => navigate(nextStep)}/>

      <Button variant="link" onClick={() => navigate(nextStep)}>Skip for now</Button>
    </SetupWrapper>
  )
})
