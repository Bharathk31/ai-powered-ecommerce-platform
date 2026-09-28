import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

import '../starting-code/styles/shared/general.css';
import '../starting-code/styles/shared/header.css';
import '../starting-code/styles/pages/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);