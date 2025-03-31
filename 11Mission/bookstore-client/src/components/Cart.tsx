// src/components/Cart.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Table, Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
    const { items, removeFromCart, updateQuantity, clearCart, total, lastAddedFrom } = useCart();
    const navigate = useNavigate();

    const handleContinueShopping = () => {
        navigate(lastAddedFrom || '/');
    };

    if (items.length === 0) {
        return (
            <Container className="text-center py-5">
                <h2>Your cart is empty</h2>
                <p>Go back to the book list to add some books to your cart.</p>
                <Button variant="primary" className="mt-3" onClick={() => window.location.href = '/'}>Browse Books</Button>
            </Container>
        );
    }

    return (
        <Container>
            <h2 className="mb-4">Your Shopping Cart</h2>

            <Table responsive hover>
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
                            <InputGroup style={{ maxWidth: '120px' }}>
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                                >
                                    -
                                </Button>
                                <FormControl
                                    type="number"
                                    className="text-center"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => updateQuantity(item.bookId, parseInt((e.target as HTMLInputElement).value) || 1)}
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                                >
                                    +
                                </Button>
                            </InputGroup>
                        </td>
                        <td>${item.subtotal.toFixed(2)}</td>
                        <td>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => removeFromCart(item.bookId)}
                            >
                                <i className="bi bi-trash"></i> Remove
                            </Button>
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
            </Table>

            <Row className="mt-4">
                <Col xs={12} md={6}>
                    <Button
                        variant="secondary"
                        onClick={handleContinueShopping}
                    >
                        <i className="bi bi-arrow-left"></i> Continue Shopping
                    </Button>
                </Col>
                <Col xs={12} md={6} className="text-md-end mt-3 mt-md-0">
                    <Button
                        variant="outline-danger"
                        className="me-2"
                        onClick={clearCart}
                    >
                        <i className="bi bi-trash"></i> Clear Cart
                    </Button>

                    <Button variant="success">
                        <i className="bi bi-credit-card"></i> Checkout
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Cart;