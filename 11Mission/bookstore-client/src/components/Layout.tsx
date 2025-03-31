// src/components/Layout.tsx
import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar, Container, Badge, Button } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import CartSummary from './CartSummary';
import CartOffcanvas from './CartOffcanvas';

const Layout: React.FC = () => {
    const { itemCount } = useCart();
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">Jeff's Bookstore</Navbar.Brand>
                    <Button
                        variant="outline-light"
                        className="ms-auto position-relative"
                        onClick={() => setShowOffcanvas(true)}
                    >
                        <i className="bi bi-cart-fill me-2"></i>
                        Cart
                        {itemCount > 0 && (
                            <Badge
                                bg="danger"
                                pill
                                className="position-absolute top-0 start-100 translate-middle"
                            >
                                {itemCount}
                                <span className="visually-hidden">items in cart</span>
                            </Badge>
                        )}
                    </Button>
                </Container>
            </Navbar>

            <Container className="mt-4">
                {itemCount > 0 && <CartSummary />}
                <Outlet />
            </Container>

            <footer className="bg-light text-center text-lg-start mt-5">
                <div className="text-center p-3">
                    © 2025 Bookstore - Mission #12
                </div>
            </footer>

            <CartOffcanvas
                show={showOffcanvas}
                onClose={() => setShowOffcanvas(false)}
            />
        </div>
    );
};

export default Layout;