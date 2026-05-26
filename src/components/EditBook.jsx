import { useState } from "react";
import BookForm from "./BookForm";
// import BookCoverAIRequest from "./BookCoverAIRequest";

// App.jsx 하위 부모 컴포넌트 - 책 내용 수정 페이지
function EditBook({ onTransform, onRevise, book, prevPage }) {

    const [newBook, setNewBook] = useState({
        id: book.id,
        title: book.title,
        author: book.author,
        content: book.content,
        coverImageUrl: book.coverImageUrl,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt
    });

    const handleFieldChange = (updatedBook) => {
        setNewBook(updatedBook);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newBook.title || !newBook.author) {
            alert("제목과 저자는 필수 입력 사항입니다.");
            return;
        }
        onRevise(book.id, newBook);
    };

    return (
        <>
            <h1>책 내용 수정</h1>
            <BookForm
                book={newBook}
                onFieldChange={handleFieldChange}
            />
            {/* <BookCoverAIRequest book={newBook} /> */}
            <div className="button-group">
                <button type="button" onClick={handleSubmit} className="submit-button">
                    등록
                </button>
                <button type="button" onClick={() => onTransform(prevPage, null)} className="cancel-button">
                    취소
                </button>
            </div>
        </>
    );
}

export default EditBook;