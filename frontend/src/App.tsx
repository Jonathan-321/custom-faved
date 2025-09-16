import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import './App.css'
import { observer } from 'mobx-react-lite';
import {useContext, useEffect, useState} from 'react';
import { StoreContext } from './store/storeContext';
import { LoginPage } from './components/Login/LoginPage';
import { Setup } from './components/Setup/Setup';
import { Toaster } from './components/ui/sonner';
import { Page } from './components/Dashboard/page';
import EditItemForm from './components/EditForm/EditItemForm';
import { Dialog } from './components/ui/dialog';
import { NotFound } from './components/NotFound';
import Loading from "@/components/Loading"

function SetupMiddleware() {
  const location = useLocation();

  const store = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      console.log("loadData")
      // this call sets up store.showInitializeDatabasePage
      await store.getUser(true)
      setIsLoading(false)
    };

    loadData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  // If we are not on the setup page, and need to be, redirect to setup
  const isSetupPage = location.pathname === '/setup';
  if (!isSetupPage && store.showInitializeDatabasePage) {
    return <Navigate to="/setup" replace />;
  }

  // Otherwise continue
  return <Outlet />;
}


const App = observer(() => {
   return (
    <BrowserRouter>
      <Routes>
        <Route element={<SetupMiddleware />}>
          <Route path="/" element={<Page />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/create-item"
                 element={<Dialog open={true}><EditItemForm setIsShowEditModal={() => { }} isFullScreen={true} /></Dialog>}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
})

export default App
