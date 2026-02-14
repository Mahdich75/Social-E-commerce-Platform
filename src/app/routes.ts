import { createBrowserRouter } from 'react-router';
import Layout from './Layout';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Create from './pages/Create';
import Basket from './pages/Basket';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'discover', Component: Discover },
      { path: 'create', Component: Create },
      { path: 'basket', Component: Basket },
      { path: 'profile', Component: Profile },
      { path: 'checkout', Component: Checkout },
      { path: 'messages', Component: Messages },
      { path: 'notifications', Component: Notifications },
    ],
  },
]);
