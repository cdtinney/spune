import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ReceiverApp from './ReceiverApp';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReceiverApp />
  </StrictMode>,
);
