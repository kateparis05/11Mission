// src/pages/BookList.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Book, BooksResponse } from '../types/types';
import { useCart } from '../contexts/CartContext';
import Toast from '../components/Toast';
import axios from 'axios';

const BookList: React.FC = () => {
    const { category = 'all', page = '1' } = useParams<{ category?: string, page?: string }>();
    const [books, setBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageNumber, setPageNumber] = useState(parseInt(page) || 1);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const pageSize = 5;
    const { addToCart, setLastAddedFrom } = useCart();
    const navigate = useNavigate();

    // Fetch available categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5225/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Fetch books with filtering
    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const currentPage = parseInt(page) || 1;
                setPageNumber(currentPage);

                console.log("Fetching books:", `http://localhost:5225/api/books?pageNumber=${currentPage}&pageSize=${pageSize}&category=${category}`);

                const response = await axios.get<BooksResponse>(
                    `http://localhost:5225/api/books?pageNumber=${currentPage}&pageSize=${pageSize}&category=${category}`
                );

                console.log("API Response:", response.data); // Add this line to debug

                if (response.data && response.data.books) {
                    setBooks(response.data.books);
                    setTotalItems(response.data.totalItems);
                    console.log("Books set:", response.data.books);
                } else {
                    console.error("Invalid response format:", response.data);
                    setBooks([]);
                    setTotalItems(0);
                }
            } catch (error) {
                console.error('Error fetching books:', error);
                setBooks([]);
                setTotalItems(0);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [category, page, pageSize]);

    const pageCount = Math.ceil(totalItems / pageSize);

    const handleAddToCart = async (book: Book) => {
        try {
            const response = await axios.post('http://localhost:5225/api/cart', {
                bookId: book.bookID,
                quantity: 1
            });

            addToCart({
                bookId: book.bookID,
                title: book.title,
                author: book.author,
                price: book.price,
                quantity: 1,
                subtotal: book.price
            });

            // Save current path for "Continue Shopping"
            setLastAddedFrom(window.location.pathname);

            // Show toast
            setToastMessage(`${book.title} has been added to your cart!`);
            setShowToast(true);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value;
        navigate(`/books/category/${newCategory}/page/1`);
    };

    return (
        <div className="container">
            <div className="row mb-4">
                <div className="col-md-6">
                    <h2>Book List</h2>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="category-filter" className="form-label">Filter by Category:</label>
                        <select
                            id="category-filter"
                            className="form-select"
                            value={category}
                            onChange={handleCategoryChange}
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="row row-cols-1 g-4">
                        {books.map(book => (
                            <div key={book.bookID} className="col">
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-8">
                                                <h5 className="card-title">{book.title}</h5>
                                                <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
                                                <p className="card-text">
                                                    <small>
                                                        Publisher: {book.publisher}<br />
                                                        ISBN: {book.isbn}<br />
                                                        Classification: {book.classification}<br />
                                                        Category: <span className="badge bg-secondary">{book.category}</span><br />
                                                        Pages: {book.pageCount}
                                                    </small>
                                                </p>
                                            </div>
                                            <div className="col-md-4 d-flex flex-column align-items-end justify-content-between">
                                                <div className="mb-3 text-end">
                                                    <span className="h5">${book.price.toFixed(2)}</span>
                                                </div>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleAddToCart(book)}
                                                >
                                                    <i className="bi bi-cart-plus"></i> Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center mt-4">
                        <nav aria-label="Page navigation">
                            <ul className="pagination">
                                <li className={`page-item ${pageNumber <= 1 ? 'disabled' : ''}`}>
                                    <Link
                                        className="page-link"
                                        to={`/books/category/${category}/page/${pageNumber - 1}`}
                                        aria-label="Previous"
                                    >
                                        <span aria-hidden="true">&laquo;</span>
                                    </Link>
                                </li>

                                {Array.from({length: pageCount}, (_, i) => i).map(i => (
                                    <li
                                        key={i + 1}
                                        className={`page-item ${pageNumber === i + 1 ? 'active' : ''}`}
                                    >
                                        <Link
                                            className="page-link"
                                            to={`/books/category/${category}/page/${i + 1}`}
                                        >
                                            {i + 1}
                                        </Link>
                                    </li>
                                ))}

                                <li className={`page-item ${pageNumber >= pageCount ? 'disabled' : ''}`}>
                                    <Link
                                        className="page-link"
                                        to={`/books/category/${category}/page/${pageNumber + 1}`}
                                        aria-label="Next"
                                    >
                                        <span aria-hidden="true">&raquo;</span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </>
            )}

            {/* Toast notification */}
            <Toast
                show={showToast}
                message={toastMessage}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default BookList;