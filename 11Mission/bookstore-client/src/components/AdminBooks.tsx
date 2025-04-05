// src/components/AdminBooks.tsx
import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Book } from '../types/types';

const AdminBooks: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBook, setCurrentBook] = useState<Book>({
        bookID: 0,
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        classification: '',
        category: '',
        pageCount: 0,
        price: 0
    });

    // API base URL
    const apiBaseUrl = 'http://localhost:5225';

    // Fetch books
    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiBaseUrl}/api/books?pageSize=100`);
            setBooks(response.data.books);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentBook(prev => ({
            ...prev,
            [name]: name === 'pageCount' || name === 'price'
                ? parseFloat(value)
                : value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Update existing book
                await axios.put(`${apiBaseUrl}/api/books/${currentBook.bookID}`, currentBook);
            } else {
                // Add new book
                await axios.post(`${apiBaseUrl}/api/books`, currentBook);
            }

            // Refresh book list
            fetchBooks();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving book:', error);
        }
    };

    // Handle book deletion
    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await axios.delete(`${apiBaseUrl}/api/books/${id}`);
                // Refresh book list
                fetchBooks();
            } catch (error) {
                console.error('Error deleting book:', error);
            }
        }
    };

    // Show modal for adding a new book
    const handleShowAddModal = () => {
        setCurrentBook({
            bookID: 0,
            title: '',
            author: '',
            publisher: '',
            isbn: '',
            classification: '',
            category: '',
            pageCount: 0,
            price: 0
        });
        setIsEditing(false);
        setShowModal(true);
    };

    // Show modal for editing a book
    const handleShowEditModal = (book: Book) => {
        setCurrentBook(book);
        setIsEditing(true);
        setShowModal(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="container mt-4">
            <h2>Manage Books</h2>
            <Button variant="primary" onClick={handleShowAddModal} className="mb-3">
                Add New Book
            </Button>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {books.map(book => (
                        <tr key={book.bookID}>
                            <td>{book.bookID}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.category}</td>
                            <td>${book.price.toFixed(2)}</td>
                            <td>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleShowEditModal(book)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(book.bookID)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}

            {/* Add/Edit Book Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Book' : 'Add New Book'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={currentBook.title}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Author</Form.Label>
                            <Form.Control
                                type="text"
                                name="author"
                                value={currentBook.author}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Publisher</Form.Label>
                            <Form.Control
                                type="text"
                                name="publisher"
                                value={currentBook.publisher}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>ISBN</Form.Label>
                            <Form.Control
                                type="text"
                                name="isbn"
                                value={currentBook.isbn}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Classification</Form.Label>
                            <Form.Control
                                type="text"
                                name="classification"
                                value={currentBook.classification}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                name="category"
                                value={currentBook.category}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Page Count</Form.Label>
                            <Form.Control
                                type="number"
                                name="pageCount"
                                value={currentBook.pageCount}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                step="0.01"
                                value={currentBook.price}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Save
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminBooks;