import React, { createContext, useState, useEffect, useContext } from 'react';
import { wishlistService } from '../services/wishlistService';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }
    try {
      setLoading(true);
      const res = await wishlistService.getWishlist();
      if (res.success) {
        setWishlistItems(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const addToWishlist = async (productId) => {
    try {
      const res = await wishlistService.addToWishlist(productId);
      if (res.success) {
        await fetchWishlist();
      }
      return res;
    } catch (error) {
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await wishlistService.removeFromWishlist(productId);
      if (res.success) {
        setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
      }
      return res;
    } catch (error) {
      throw error;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
