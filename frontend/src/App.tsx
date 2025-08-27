import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { StoreContext } from './store/storeContext';
import { LoginPage } from './components/Login/LoginPage';
import { Setup } from './components/Setup/Setup';
import { Toaster } from './components/ui/sonner';
import EditItemFormfullPage from './components/EditForm/EditItemFormFullPage';
import { Page } from './components/dashboard/page';
import EditItemForm from './components/EditForm/EditItemForm';
import { Dialog } from './components/ui/dialog';



const App = observer(() => {
  const store = useContext(StoreContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/main" element={<Page />} />
        <Route path="/edit" element={<Dialog open={true}><EditItemForm setIsShowEditModal={() => { }} isFullScreen={true} /></Dialog>} />
        <Route
          path="/"
          element={store.showLoginPage ? <Navigate to="/login" replace={true} /> : <Navigate to="/main" />}
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
})

export default App
