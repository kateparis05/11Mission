// src/pages/Cart.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
    const { items, removeFromCart, updateQuantity, clearCart, total, lastAddedFrom } = useCart();
    const navigate = useNavigate();

    const handleContinueShopping = () => {
        navigate(lastAddedFrom || '/');
    };

    if (items.length === 0) {
        return (
            <div className="container text-center py-5">
                <h2>Your cart is empty</h2>
                <p>Go back to the book list to add some books to your cart.</p>
                <Link to="/" className="btn btn-primary mt-3">Browse Books</Link>
            </div>
        );
    }

    return (
        <div className="container">
            <h2 className="mb-4">Your Shopping Cart</h2>

            <div className="table-responsive">
                <table className="table table-hover">
                    <thead className="table-light">
                    <tr>
                        <th>Book</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map(item => (
                        <tr key={item.bookId}>
                            <td>
                                <h5>{item.title}</h5>
                                <p className="text-muted">{item.author}</p>
                            </td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>
                                <div className="input-group" style={{ maxWidth: '120px' }}>
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        className="form-control text-center"
                                        value={item.quantity}
                                        min="1"
                                        onChange={(e) => updateQuantity(item.bookId, parseInt(e.target.value) || 1)}
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </td>
                            <td>${item.subtotal.toFixed(2)}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => removeFromCart(item.bookId)}
                                >
                                    <i className="bi bi-trash"></i> Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan={3} className="text-end fw-bold">Total:</td>
                        <td className="fw-bold">${total.toFixed(2)}</td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>

            <div className="d-flex justify-content-between mt-4">
                <button
                    className="btn btn-secondary"
                    onClick={handleContinueShopping}
                >
                    <i className="bi bi-arrow-left"></i> Continue Shopping
                </button>

                <div>
                    <button
                        className="btn btn-outline-danger me-2"
                        onClick={clearCart}
                    >
                        <i className="bi bi-trash"></i> Clear Cart
                    </button>

                    <button className="btn btn-success">
                        <i className="bi bi-credit-card"></i> Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;