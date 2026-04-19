import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import AppRoutes from './app/routes/AppRoutes';
import './index.css';

if (typeof document !== 'undefined') {
  document.documentElement.classList.remove('dark');
}

if (typeof window !== 'undefined') {
  window.localStorage.removeItem('priocare_theme');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  </React.StrictMode>,
);
