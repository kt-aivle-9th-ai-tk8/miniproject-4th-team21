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
import ProblemOccured from './components/ProblemOccured';
function App() {
  // 1. 상태(State) 관리
  const [books, setBooks] = useState([]); // 전체 도서 목록 상태
  const [currentView, setCurrentView] = useState('list');
  const [selectedBookId, setSelectedBookId] = useState(999); // 선택된 도서의 ID 관리
  const [prevPage, setPrevPage] = useState('list'); // 이전 페이지(화면) 저장

  // 백엔드 데이터베이스 연결 주소
  const API_URL = 'http://localhost:8080/books';

  const runBookRequest = async (request, { errorMessage } = {}) => {
    try {
      const response = await request();

      if (response.ok) {
        // Some responses may have an empty body even with 2xx; content-length may be unavailable in browsers.
        const text = await response.text();
        if (!text) {
          return { success: true, status: response.status, data: null };
        }

        try {
          const data = JSON.parse(text);
          return { success: true, status: response.status, data };
        } catch (error) {
          console.error('JSON 파싱 실패:', error);
          return { success: false, status: response.status, errorType: 'PARSE_ERROR', error, data: null };
        }
      }

      let errorBody = null;
      try {
        errorBody = await response.json();
      } catch {
        try {
          errorBody = await response.text();
        } catch {}
      }
      return { success: false, status: response.status, errorType: response.status >= 500 ? 'SERVER_ERROR' : 'CLIENT_ERROR', error: errorBody };
    } catch (error) {
      if (errorMessage) {
        console.error(errorMessage, error);
      }
      return { success: false, status: null, errorType: 'NETWORK_ERROR', error };
    }
  };

  // 2. 초기 데이터 로드 (fetch + GET)
  useEffect(() => {
    fetchBooks(); // 처음 켰을 때는 빈 조건으로 전체 목록 조회
  }, []);

  const fetchBooks = async (filterData = null) => {
    let url = API_URL;


    if (filterData) {
      const { category, searchType, keyword } = filterData;
      // 예: http://localhost:8080/books?category=소설&searchType=title&keyword=자바
      url = `${API_URL}?category=${encodeURIComponent(category)}&searchType=${encodeURIComponent(searchType)}&keyword=${encodeURIComponent(keyword)}`;
    }

    const booksResponse = await runBookRequest(
      () => fetch(url),
      {
        errorMessage: '도서 목록을 불러오는 중 오류 발생:',
      }
    );

    if (booksResponse.success) {
      setBooks(Array.isArray(booksResponse.data) ? booksResponse.data : []);
    } else {
      if (booksResponse.errorType === 'NETWORK_ERROR' || booksResponse.errorType === 'SERVER_ERROR') {
        setCurrentView('backendunavailable');
      } else {
        setCurrentView('problemoccured');
      }
    }
  };

  // 3. 화면 전환 핸들러 (인자: bookId정수값, view이름)
  const handleTransform = (viewName, bookId) => {
    setPrevPage(currentView); // 화면 전환전 화면을 저장
    setCurrentView(viewName);
    setSelectedBookId(bookId);
  };

  // AI 표지가 성공적으로 생성되었을 때 호출되는 백엔드 PATCH 콜백
  const handleUpdateCoverApi = async (bookId, updatedBookWithImage) => {
    const coverResponse = await runBookRequest(
      () => fetch(`${API_URL}/${bookId}/cover`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coverImageUrl: updatedBookWithImage.coverImageUrl,
        }),
      }),
      { errorMessage: 'PATCH 요청 중 오류 발생:' }
    );

    if (coverResponse.success) {
      const finalBook = coverResponse.data;
      alert("생성된 AI 표지가 최종 반영되었습니다!");
      setBooks(prevBooks => prevBooks.map(b => b.id === finalBook.id ? finalBook : b));
      setSelectedBookId(finalBook.id);
      setCurrentView('list');
      return true;
    } else {
      if (coverResponse.errorType === 'NETWORK_ERROR' || coverResponse.errorType === 'SERVER_ERROR') {
        setCurrentView('backendunavailable');
      } else if (coverResponse.status === 404) {
        setCurrentView('unavailable');
      } else {
        setCurrentView('problemoccured');
      }
      alert("표지를 저장하는 데 실패했습니다.");
      return false;
    }
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

    const newBookResponse = await runBookRequest(
      () => fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookWithTimestamps),
      }),
      { errorMessage: '도서 등록 실패:' }
    );

    if (newBookResponse.success) {
      setBooks(prevBooks => [...prevBooks, newBookResponse.data]);
      setCurrentView('view');
      setSelectedBookId(newBookResponse.data.id);
    } else {
      if (newBookResponse.errorType === 'NETWORK_ERROR' || newBookResponse.errorType === 'SERVER_ERROR') {
        setCurrentView('backendunavailable');
      } else {
        setCurrentView('problemoccured');
      }
    }
  };

  // 기존 도서 수정 (onRevise) update(patch)
  const handleRevise = async (bookId, bookObject) => {
    const currentTime = new Date().toISOString();
    const bookWithTimestamps = {
      ...bookObject,
      updatedAt: currentTime
    };

    const revisedBookResponse = await runBookRequest(
      () => fetch(`${API_URL}/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookWithTimestamps),
      }),
      { errorMessage: '도서 수정 실패:' }
    );

    if (revisedBookResponse.success) {
      setBooks(prevBooks => prevBooks.map(book => book.id === bookId ? revisedBookResponse.data : book));
      setCurrentView('view');
      setSelectedBookId(revisedBookResponse.data.id);
    } else {
      if (revisedBookResponse.errorType === 'NETWORK_ERROR' || revisedBookResponse.errorType === 'SERVER_ERROR') {
        setCurrentView('backendunavailable');
      } else if (revisedBookResponse.status === 404) {
        setCurrentView('unavailable');
      } else {
        setCurrentView('problemoccured');
      }
    }
  };

  // 특정 도서 삭제 (onDelete) delete
  const handleDelete = async (bookId) => {
    const deleted = await runBookRequest(
      () => fetch(`${API_URL}/${bookId}`, {
        method: 'DELETE',
      }),
      { errorMessage: '도서 삭제 실패:' }
    );

    if (deleted.success) {
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
      setCurrentView('list');
      setSelectedBookId(null);
    } else {
      if (deleted.errorType === 'NETWORK_ERROR' || deleted.errorType === 'SERVER_ERROR') {
        setCurrentView('backendunavailable');
      } else if (deleted.status === 404) {
        setCurrentView('unavailable');
      } else {
        setCurrentView('problemoccured');
      }
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
            onUpdateCover={handleUpdateCoverApi}
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
      case 'problemoccured':
        return (
          <ProblemOccured />
        );
      default:
        return <BookList books={books} onTransform={handleTransform} onSearch={fetchBooks} />;
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
