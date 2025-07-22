import { Settings } from './components/Settings/Settings'
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from './components/ui/button';
import EditItemForm from './components/EditForm/EditItemForm';



function App() {
  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
  const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

  const submitRequest = (method, action, csrfToken, alertMessage) => {

    if (alertMessage && !confirm(alertMessage)) {
      return;
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = action;

    const addInput = (name, value) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };
    addInput('force-method', method);
    addInput('csrf_token', csrfToken);

    document.body.appendChild(form);
    form.submit();
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <Button>Click me</Button>
<EditItemForm />
      </div>
    </BrowserRouter>
  )
}

export default App
