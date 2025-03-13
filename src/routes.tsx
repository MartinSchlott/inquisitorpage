import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import NotFound from './components/NotFound';

export const router = createBrowserRouter([
  {
    path: '/*',
    element: <App />,
    errorElement: <NotFound />,
  },
]); 