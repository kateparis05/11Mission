// src/types/Book.ts
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

export interface BookResponse {
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    books: Book[];
}