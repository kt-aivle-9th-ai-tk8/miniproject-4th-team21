import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';
import ViewBook from './components/ViewBook';
import RemoveBook from './components/RemoveBook';
import UnavailableBook from './components/UnavailableBook';
import UnavailableBackend from './components/UnavailableBackend';

function App() {
  // 1. 상태(State) 관리
  const [books, setBooks] = useState([]); // 전체 도서 목록 상태
  const [currentView, setCurrentView] = useState('list');
  const [selectedBookId, setSelectedBookId] = useState(999); // 선택된 도서의 ID 관리
  const [prevPage, setPrevPage] = useState('list'); // 이전 페이지(화면) 저장

  // 백엔드 데이터베이스 연결 주소 -> 기존 json-server(3000) 삭제
  const API_URL = 'http://localhost:8080/books';

  const runBookRequest = async (request, { errorMessage, onSuccess, onError } = {}) => {
    try {
      const response = await request();

      if (!response.ok) { // 정상응답(200번대) 여부 검증
        return null;
      }

      const data = response.status === 204 ? true : await response.json(); // 204 No Content인 경우 JSON 파싱 생략
      onSuccess?.(data);
      return data;
    } catch (error) {
      onError?.(error);
      if (errorMessage) {
        console.error(errorMessage, error);
      }
      return null;
    }
  };

  // 2. 초기 데이터 로드 (fetch + GET)
  useEffect(() => {
    fetchBooks(); // 처음 켰을 때는 빈 조건으로 전체 목록 조회
  }, []);

  const fetchBooks = async (filterData = null) => {
    let url = API_URL;

  
    if (filterData) {
      const { category, searchField, keyword } = filterData;
      // 예: http://localhost:8080/books?category=소설&searchField=title&keyword=자바
      url = `${API_URL}?category=${encodeURIComponent(category)}&searchField=${encodeURIComponent(searchField)}&keyword=${encodeURIComponent(keyword)}`;
    }

    const booksData = await runBookRequest(
      () => fetch(url),
      {
        errorMessage: '도서 목록을 불러오는 중 오류 발생:',
        onError: () => setCurrentView('backendunavailable'),
      }
    );

    if (booksData) {
      setBooks(booksData);
    }
  };

  // 3. 화면 전환 핸들러 (인자: bookId정수값, view이름)
  const handleTransform = (viewName, bookId) => {
    setPrevPage(currentView); // 화면 전환전 화면을 저장
    setCurrentView(viewName);
    setSelectedBookId(bookId);
  };

  // 4. CRUD 비즈니스 로직 핸들러
  
  // 신규 도서 등록 (onSubmit) post
  const handleSubmit = async (bookObject) => {
    const currentTime = new Date().toISOString();
    const bookWithTimestamps = {
      ...bookObject,
      createdAt: currentTime,
      updatedAt: currentTime
    };

    const newBook = await runBookRequest(
      () => fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookWithTimestamps),
      }),
      { errorMessage: '도서 등록 실패:' }
    );

    if (newBook) {
      setBooks(prevBooks => [...prevBooks, newBook]); 
      setCurrentView('view'); 
      setSelectedBookId(newBook.id);
    }
  };

  // 기존 도서 수정 (onRevise) update(patch)
  const handleRevise = async (bookId, bookObject) => {
    const currentTime = new Date().toISOString();
    const bookWithTimestamps = {
      ...bookObject,
      updatedAt: currentTime
    };

    const response = await fetch(`${API_URL}/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookWithTimestamps),
    });

    if (response.status === 404) {
      setCurrentView('unavailable');
      setSelectedBookId(null);
      return;
    }

    if (!response.ok) {
      console.error('도서 수정 실패:');
      return;
    }

    const revisedBook = await response.json();

    setBooks(prevBooks => prevBooks.map(book => book.id === bookId ? revisedBook : book)); 
    setCurrentView('view'); 
    setSelectedBookId(revisedBook.id);
  };

  // 특정 도서 삭제 (onDelete) delete
  const handleDelete = async (bookId) => {
    const deleted = await runBookRequest(
      () => fetch(`${API_URL}/${bookId}`, {
        method: 'DELETE',
      }),
      { errorMessage: '도서 삭제 실패:' }
    );

    if (deleted !== null) {
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
      setCurrentView('list'); 
    }
  };

  const currentBook = books.find(book => book.id === selectedBookId);

  const renderView = () => {
    switch (currentView) {
      case 'list':
        return (
          <BookList 
            books={books} 
            onTransform={handleTransform} 
            onSearch={fetchBooks}
          />
        );
      case 'add':
        return (
          <AddBook 
            onSubmit={handleSubmit} 
            onTransform={handleTransform}
          />
        );
      case 'edit':
        return (
          <EditBook 
            book={currentBook} 
            onRevise={handleRevise} 
            onTransform={handleTransform}
            prevPage={prevPage}
          />
        );
      case 'view':
        return (
          <ViewBook 
            book={currentBook} 
            onTransform={handleTransform}
            setBooks={setBooks}
          />
        );
      case 'remove':
        return (
          <RemoveBook 
            book={currentBook}
            onDelete={handleDelete} 
            onTransform={handleTransform}
            prevPage={prevPage}
          />
        );
      case 'unavailable': 
        return (
          <UnavailableBook />
        );
      case 'backendunavailable':
        return (
          <UnavailableBackend />
        );
      default:
        return <BookList books={books} onTransform={handleTransform} onSearch={handleSearchSubmit} />;
    }
  };

  return (
    <div className="app-container">
      {currentView !== 'backendunavailable' && ( 
        <Header onTransform={handleTransform} currentPage={currentView} />
      )}
      
      <main className="main-content">
        {renderView()}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;