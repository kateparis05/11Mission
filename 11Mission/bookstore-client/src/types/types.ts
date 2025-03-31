// src/types/types.ts
export interface Book {
    bookID: number;
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    classification: string;
    category: string;
    pageCount: number;
    price: number;
}

export interface CartItem {
    bookId: number;
    title: string;
    author: string;
    price: number;
    quantity: number;
    subtotal: number;
}

export interface BooksResponse {
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    category: string;
    books: Book[];
}