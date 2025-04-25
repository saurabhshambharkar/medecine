import React from 'react';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from '../Cart/CartSidebar';
import Toast from '../UI/Toast';
import { useCart } from '../../contexts/CartContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isCartOpen } = useCart();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <CartSidebar isOpen={isCartOpen} />
      <Toast />
    </div>
  );
};

export default Layout;