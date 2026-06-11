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
  const [currentView, setCurrentView] = useState('edit'); // 현재 화면 (list, add, edit, view, remove, unavailable, backendunavailable)
  const [selectedBookId, setSelectedBookId] = useState(999); // 선택된 도서의 ID 관리
  const [prevPage, setPrevPage] = useState('list'); // 이전 페이지(화면) 저장

  // json-server 연동을 위한 베이스 URL
  const API_URL = 'http://localhost:3000/books';

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
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const booksData = await runBookRequest(
      () => fetch(API_URL),
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
  
  // 신규 도서 등록 (onSubmit)
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
      setBooks(prevBooks => [...prevBooks, newBook]); // await fetchBooks(); // 목록 갱신
      setCurrentView('view'); // 등록 후 리스트로 이동
      setSelectedBookId(newBook.id);
    }
  };

  // 기존 도서 수정 (onRevise)
  const handleRevise = async (bookId, bookObject) => {
    const currentTime = new Date().toISOString();
    const bookWithTimestamps = {
      ...bookObject,
      updatedAt: currentTime
    };

    const revisedBook = await runBookRequest(
      () => fetch(`${API_URL}/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookWithTimestamps),
      }),
      { errorMessage: '도서 수정 실패:' }
    );

    if (revisedBook) {
      setBooks(prevBooks => prevBooks.map(book => book.id === bookId ? revisedBook : book)); // await fetchBooks(); // 목록 갱신
      setCurrentView('view'); // 수정 후 리스트로 이동
      setSelectedBookId(revisedBook.id);
    }
  };

  // 특정 도서 삭제 (onDelete)
  const handleDelete = async (bookId) => {
    const deleted = await runBookRequest(
      () => fetch(`${API_URL}/${bookId}`, {
        method: 'DELETE',
      }),
      { errorMessage: '도서 삭제 실패:' }
    );

    if (deleted !== null) {
      // 삭제 시 목록에서도 즉시 반영 (상태 업데이트)
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
      setCurrentView('list'); // 삭제 후 리스트로 이동
    }
  };

  // 현재 선택된 단일 도서 객체 찾기
  const currentBook = books.find(book => book.id === selectedBookId);

  // 5. 조건부 렌더링을 통한 화면 제어
  const renderView = () => {
    switch (currentView) {
      case 'list':
        return (
          <BookList 
            books={books} 
            onTransform={handleTransform} 
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
        return <BookList books={books} onTransform={handleTransform} />;
    }
  };

  return (
    <div className="app-container">
      {/* 공통 헤더 컴포넌트 */}
      {currentView !== 'backendunavailable' && ( // 백엔드 서비스 불가 화면에서는 헤더 숨김 --> 메뉴변경 방지
        <Header onTransform={handleTransform} currentPage={currentView} />
      )}
      
      {/* 메인 콘텐츠 영역 (조건부 렌더링) */}
      <main className="main-content">
        {renderView()}
      </main>
      
      {/* 공통 푸터 컴포넌트 */}
      <Footer />
    </div>
  );
}

export default App;