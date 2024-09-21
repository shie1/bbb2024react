import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import PageContainer from './components/PageContainer';
import Tankolas from './pages/Tankolas';

export const theme = extendTheme({
  fonts: {
    body: "Montserrat, sans-serif",
  },
})

export const routes = [
  {
    name: 'Főoldal',
    href: '/',
    element: <Home />
  },
  {
    name: "Tankolás",
    href: '/tankolas',
    element: <Tankolas />
  }
]

const router = createBrowserRouter(
  createRoutesFromElements(
    routes.map(route => <Route key={route.href} path={route.href} element={<PageContainer>{route.element}</PageContainer>} />)
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme} toastOptions={{
      defaultOptions: {
        duration: 5000,
        isClosable: true,
      }
    }}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);