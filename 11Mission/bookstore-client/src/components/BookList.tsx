// src/components/BookList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, Pagination, Form, Alert } from 'react-bootstrap';
import { Book, BookResponse } from '../types/Book';

const BookList: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [sortBy, setSortBy] = useState('Title');
    const [sortDirection, setSortDirection] = useState('asc');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const pageSizeOptions = [5, 10, 25, 50];

    // Updated port to match your running backend
    const apiBaseUrl = 'http://localhost:5225';

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('Attempting to fetch books from:', `${apiBaseUrl}/api/books`);
            const response = await axios.get<BookResponse>(
                `${apiBaseUrl}/api/books?pageNumber=${currentPage}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`
            );
            setBooks(response.data.books);
            setTotalItems(response.data.totalItems);
            console.log('Successfully fetched books:', response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
            setError("Could not connect to the API server. Please ensure the backend is running.");
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, sortBy, sortDirection]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const totalPages = Math.ceil(totalItems / pageSize);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when changing page size
    };

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDirection('asc');
        }
    };

    const renderSortIcon = (column: string) => {
        if (sortBy !== column) return null;
        return sortDirection === 'asc' ? ' ▲' : ' ▼';
    };

    return (
        <div className="book-list-container">
            <h2 className="my-4">Bookstore Inventory</h2>

            {error && (
                <Alert variant="danger">
                    {error}
                    <hr />
                    <p className="mb-0">
                        Troubleshooting tips:
                        <ul>
                            <li>Make sure your ASP.NET Core API is running</li>
                            <li>Check the terminal where you started the API to confirm the URL/port</li>
                            <li>Verify CORS is properly configured in Program.cs</li>
                        </ul>
                    </p>
                </Alert>
            )}

            {loading && <p>Loading books...</p>}

            <div className="d-flex justify-content-end mb-3">
                <Form.Group style={{ width: '200px' }}>
                    <Form.Label>Books per page:</Form.Label>
                    <Form.Select value={pageSize} onChange={handlePageSizeChange}>
                        {pageSizeOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th onClick={() => handleSort('Title')} style={{ cursor: 'pointer' }}>
                        Title {renderSortIcon('Title')}
                    </th>
                    <th onClick={() => handleSort('Author')} style={{ cursor: 'pointer' }}>
                        Author {renderSortIcon('Author')}
                    </th>
                    <th onClick={() => handleSort('Publisher')} style={{ cursor: 'pointer' }}>
                        Publisher {renderSortIcon('Publisher')}
                    </th>
                    <th>ISBN</th>
                    <th>Classification</th>
                    <th>Category</th>
                    <th>Pages</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>
                {books.length > 0 ? (
                    books.map(book => (
                        <tr key={book.bookID}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.publisher}</td>
                            <td>{book.isbn}</td>
                            <td>{book.classification}</td>
                            <td>{book.category}</td>
                            <td>{book.pageCount}</td>
                            <td>${book.price.toFixed(2)}</td>
                        </tr>
                    ))
                ) : !loading && !error ? (
                    <tr>
                        <td colSpan={8} className="text-center">No books found</td>
                    </tr>
                ) : null}
                </tbody>
            </Table>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    Showing {books.length} of {totalItems} books
                </div>
                {totalPages > 0 && (
                    <Pagination>
                        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => Math.abs(page - currentPage) < 3 || page === 1 || page === totalPages)
                            .map((page, index, array) => {
                                const needsEllipsis = index > 0 && page - array[index - 1] > 1;
                                return (
                                    <React.Fragment key={page}>
                                        {needsEllipsis && <Pagination.Ellipsis disabled />}
                                        <Pagination.Item
                                            active={page === currentPage}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </Pagination.Item>
                                    </React.Fragment>
                                );
                            })}

                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                )}
            </div>
        </div>
    );
};

export default BookList;