// src/App.tsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar } from 'react-bootstrap';
import BookList from './components/BookList';

function App() {
  return (
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="#home">Jeff's Bookstore</Navbar.Brand>
          </Container>
        </Navbar>

        <Container className="mt-4">
          <BookList />
        </Container>

        <footer className="bg-light text-center text-lg-start mt-5">
          <div className="text-center p-3">
            © 2025 Bookstore - Mission #11
          </div>
        </footer>
      </div>
  );
}

export default App;