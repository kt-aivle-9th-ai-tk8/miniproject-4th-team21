import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';
import ViewBook from './components/ViewBook';
import RemoveBook from './components/RemoveBook';
import UnavailableBook from './components/UnavailableBook';
import ProblemOccured from './components/ProblemOccured';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books/new" element={<AddBook />} />
          <Route path="/books/:id" element={<ViewBook />} />
          <Route path="/books/:id/edit" element={<EditBook />} />
          <Route path="/books/:id/delete" element={<RemoveBook />} />
          <Route path="/error/not-found" element={<UnavailableBook />} />
          <Route path="/error" element={<ProblemOccured />} />
          <Route path="*" element={<UnavailableBook />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
