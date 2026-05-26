import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';
import ViewBook from './components/ViewBook';
import RemoveBook from './components/RemoveBook';

function App() {
  // 1. 상태(State) 관리
  const [books, setBooks] = useState([]); // 전체 도서 목록 상태
  const [currentView, setCurrentView] = useState('list'); // 현재 화면 (list, add, edit, view, remove)
  const [selectedBookId, setSelectedBookId] = useState(null); // 선택된 도서의 ID 관리
  const [prevPage, setPrevPage] = useState('list'); // 이전 페이지(화면) 저장

  // json-server 연동을 위한 베이스 URL
  const API_URL = 'http://localhost:3000/books';

  // 2. 초기 데이터 로드 (fetch + GET)
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error("도서 목록을 불러오는 중 오류 발생:", error);
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
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookObject),
      });
      if (response.ok) {
        const newBook = await response.json();
        setBooks(prevBooks => [...prevBooks, newBook]); // await fetchBooks(); // 목록 갱신
        setCurrentView('view'); // 등록 후 리스트로 이동
        setSelectedBookId(newBook.id);
      }
    } catch (error) {
      console.error("도서 등록 실패:", error);
    }
  };

  // 기존 도서 수정 (onRevise)
  const handleRevise = async (bookId, bookObject) => {
    try {
      const response = await fetch(`${API_URL}/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookObject),
      });
      if (response.ok) {
        const revisedBook = await response.json();
        setBooks(prevBooks => prevBooks.map(book => book.id === bookId ? revisedBook : book)); // await fetchBooks(); // 목록 갱신
        setCurrentView('view'); // 수정 후 리스트로 이동
        setSelectedBookId(revisedBook.id);
      }
    } catch (error) {
      console.error("도서 수정 실패:", error);
    }
  };

  // 특정 도서 삭제 (onDelete)
  const handleDelete = async (bookId) => {
    try {
      const response = await fetch(`${API_URL}/${bookId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // 삭제 시 목록에서도 즉시 반영 (상태 업데이트)
        setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
        setCurrentView('list'); // 삭제 후 리스트로 이동
      }
    } catch (error) {
      console.error("도서 삭제 실패:", error);
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
        if (!currentBook)
          return (
            <>
              <h1><center>다책 정보를 찾을 수 없습니. 도서 리스트로 돌아가십시오</center></h1>
              {/*예쁜 코드로 수정 필요 & 오류방지용 간단 작성*/}
            </>
          );
        return (
          <EditBook 
            book={currentBook} 
            onRevise={handleRevise} 
            onTransform={handleTransform}
            prevPage={prevPage}
          />
        );
      case 'view':
        if (!currentBook)
          return (
            <>
              <h1><center>책 정보를 찾을 수 없습니다. 도서 리스트로 돌아가십시오</center></h1>
              {/*예쁜 코드로 수정 필요 & 오류방지용 간단 작성*/}
            </>
          );
        return (
          <ViewBook 
            book={currentBook} 
            onTransform={handleTransform}
          />
        );
      case 'remove':
        if (!currentBook)
          return (
            <>
              <h1><center>책 정보를 찾을 수 없습니다. 도서 리스트로 돌아가십시오</center></h1>
              {/*예쁜 코드로 수정 필요 & 오류방지용 간단 작성*/}
            </>
          );
        return (
          <RemoveBook 
            book={currentBook}
            onDelete={handleDelete} 
            onTransform={handleTransform}
            prevPage={prevPage}
          />
        );
      default:
        return <BookList books={books} onTransform={handleTransform} />;
    }
  };

  return (
    <div className="app-container">
      {/* 공통 헤더 컴포넌트 */}
      <Header onTransform={handleTransform} />
      
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