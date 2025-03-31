// src/components/CartSummary.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const CartSummary: React.FC = () => {
    const { itemCount, total } = useCart();

    return (
        <div className="card mb-4 shadow-sm" id="cart-toast">
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <h5 className="mb-0">Your Cart: {itemCount} {itemCount === 1 ? 'item' : 'items'} (${total.toFixed(2)})</h5>
                    </div>
                    <div className="col-md-4 text-md-end">
                        <Link to="/cart" className="btn btn-primary">
                            View Cart
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;