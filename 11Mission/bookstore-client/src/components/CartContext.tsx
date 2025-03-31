// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of a cart item
export interface CartItem {
    bookId: number;
    title: string;
    author: string;
    price: number;
    quantity: number;
    subtotal: number;
}

// Define the shape of the cart context
interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (bookId: number) => void;
    updateQuantity: (bookId: number, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
    total: number;
    lastAddedFrom: string;
    setLastAddedFrom: (path: string) => void;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [lastAddedFrom, setLastAddedFrom] = useState<string>('');

    // Load cart from sessionStorage on initial load
    useEffect(() => {
        const savedCart = sessionStorage.getItem('bookstore-cart');
        if (savedCart) {
            setItems(JSON.parse(savedCart));
        }

        const savedPath = sessionStorage.getItem('last-added-from');
        if (savedPath) {
            setLastAddedFrom(savedPath);
        }
    }, []);

    // Save cart to sessionStorage whenever it changes
    useEffect(() => {
        sessionStorage.setItem('bookstore-cart', JSON.stringify(items));
    }, [items]);

    // Save lastAddedFrom to sessionStorage
    useEffect(() => {
        if (lastAddedFrom) {
            sessionStorage.setItem('last-added-from', lastAddedFrom);
        }
    }, [lastAddedFrom]);

    // Add an item to the cart
    const addToCart = (newItem: CartItem) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.bookId === newItem.bookId);

            if (existingItem) {
                // Update quantity if item already exists
                return prevItems.map(item =>
                    item.bookId === newItem.bookId
                        ? {
                            ...item,
                            quantity: item.quantity + newItem.quantity,
                            subtotal: (item.quantity + newItem.quantity) * item.price
                        }
                        : item
                );
            } else {
                // Add new item
                return [...prevItems, newItem];
            }
        });
    };

    // Remove an item from the cart
    const removeFromCart = (bookId: number) => {
        setItems(prevItems => prevItems.filter(item => item.bookId !== bookId));
    };

    // Update the quantity of an item
    const updateQuantity = (bookId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(bookId);
            return;
        }

        setItems(prevItems => prevItems.map(item =>
            item.bookId === bookId
                ? { ...item, quantity, subtotal: quantity * item.price }
                : item
        ));
    };

    // Clear the cart
    const clearCart = () => {
        setItems([]);
        sessionStorage.removeItem('bookstore-cart');
    };

    // Calculate the total number of items in the cart
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);

    // Calculate the total price of all items in the cart
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            itemCount,
            total,
            lastAddedFrom,
            setLastAddedFrom
        }}>
            {children}
        </CartContext.Provider>
    );
};

// Create a hook to use the cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};