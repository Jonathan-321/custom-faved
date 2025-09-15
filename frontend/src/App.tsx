import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { StoreContext } from './store/storeContext';
import { LoginPage } from './components/Login/LoginPage';
import { Setup } from './components/Setup/Setup';
import { Toaster } from './components/ui/sonner';
import { Page } from './components/Dashboard/page';
import EditItemForm from './components/EditForm/EditItemForm';
import { Dialog } from './components/ui/dialog';
import { NotFound } from './components/NotFound';



const App = observer(() => {
  const store = useContext(StoreContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/create-item"
          element={<Dialog open={true}><EditItemForm setIsShowEditModal={() => { }} isFullScreen={true} /></Dialog>}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
})

export default App
