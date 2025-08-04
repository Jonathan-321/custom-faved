import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import mainStore from './store/mainStore.ts'
import { StoreContext } from './store/storeContext.ts'

createRoot(document.getElementById('root')!).render(

  <StoreContext.Provider value={mainStore}>
    <App />
  </StoreContext.Provider>,
)



