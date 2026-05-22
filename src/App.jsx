import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  // 현재화면 : 'list', 'view', 'add', 'edit'
  const [view, setView] = useState('list');
  // 도서 리스트 배열
  const [bookslist, setBookList] = useState([]);

  // 화면이동과 도서 ID지정을 처리하는 함수
  const navigateTo = (nextView, bookId = null) => {
    setView(nextView);
    setSelectedBookId(bookId);
  };

  return (
    <>
      <Header/>
      <Booklist/>
      <BookForm/>
      <Footer/>
    </>
  );
}

export default App
