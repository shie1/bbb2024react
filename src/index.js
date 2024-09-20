import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ResponsiveContainer from './components/ResponsiveContainer';
import { ChakraProvider, extendTheme, Text } from '@chakra-ui/react';

export const theme = extendTheme({
  fonts: {
    body: "Montserrat, sans-serif",
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme} toastOptions={{
      defaultOptions: {
        duration: 5000,
        isClosable: true,
      }
    }}>
      <ResponsiveContainer>
      </ResponsiveContainer>
    </ChakraProvider>
  </React.StrictMode>
);