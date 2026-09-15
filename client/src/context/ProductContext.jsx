import React, { createContext, useState, useEffect } from 'react';
import { productService } from '../services/productService';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await productService.getCategories();
        if (res.success) {
          setCategories(res.data || []);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <ProductContext.Provider value={{ categories, loadingCategories }}>
      {children}
    </ProductContext.Provider>
  );
};
