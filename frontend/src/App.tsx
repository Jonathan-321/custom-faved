import { Settings } from './components/Settings/Settings'
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';


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
      <div className="row">
        <nav className="col-md-3 col-xl-2 d-md-block"> 
          <ul>
            <li><Link to="/">Settings</Link></li>
          </ul>
        </nav>

        <div className="col-md-9 col-xl-10"> 
          <div className="mb-4 d-md-none"> 
            <button 
              className="btn btn-outline-dark me-auto" 
              type="button" 
              data-bs-toggle="offcanvas"
              data-bs-target="#sidebar" 
              aria-controls="sidebar"
            >
              <i className="bi bi-list"></i>
            </button>
          </div>
          <Routes> 
            <Route path="/" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
