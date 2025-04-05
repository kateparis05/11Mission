// src/App.tsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import BookList from './components/BookList';
import Cart from './components/Cart';
import Layout from './components/Layout';
import AdminBooks from './components/AdminBooks';

function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<BookList />} />
                        <Route path="books">
                            <Route index element={<BookList />} />
                            <Route path="category/:category" element={<BookList />} />
                            <Route path="page/:page" element={<BookList />} />
                            <Route path="category/:category/page/:page" element={<BookList />} />
                        </Route>
                        <Route path="cart" element={<Cart />} />
                        <Route path="adminbooks" element={<AdminBooks />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
}

export default App;