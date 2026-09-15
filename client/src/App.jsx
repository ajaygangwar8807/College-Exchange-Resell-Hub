import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { WishlistProvider } from './context/WishlistContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <WishlistProvider>
            <AppRoutes />
          </WishlistProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
