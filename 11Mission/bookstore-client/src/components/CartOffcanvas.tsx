// src/components/CartOffcanvas.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

interface CartOffcanvasProps {
    show: boolean;
    onClose: () => void;
}

const CartOffcanvas: React.FC<CartOffcanvasProps> = ({ show, onClose }) => {
    const { items, total, removeFromCart } = useCart();

    return (
        <>
            {/* Backdrop */}
            {show && (
                <div
                    className="offcanvas-backdrop show"
                    onClick={onClose}
                ></div>
            )}

            {/* Offcanvas */}
            <div
                className={`offcanvas offcanvas-end ${show ? 'show' : ''}`}
                tabIndex={-1}
                id="cartOffcanvas"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Your Cart</h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    {items.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <>
                            <ul className="list-group mb-3">
                                {items.map(item => (
                                    <li key={item.bookId} className="list-group-item d-flex justify-content-between lh-sm">
                                        <div>
                                            <h6 className="my-0">{item.title}</h6>
                                            <small className="text-muted">
                                                {item.quantity} × ${item.price.toFixed(2)}
                                            </small>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <span className="text-muted">${item.subtotal.toFixed(2)}</span>
                                            <button
                                                className="btn btn-sm text-danger ms-2"
                                                onClick={() => removeFromCart(item.bookId)}
                                                aria-label="Remove"
                                            >
                                                <i className="bi bi-x-circle"></i>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Total</span>
                                    <strong>${total.toFixed(2)}</strong>
                                </li>
                            </ul>
                            <div className="d-grid gap-2">
                                <Link to="/cart" className="btn btn-primary" onClick={onClose}>
                                    View Cart
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartOffcanvas;