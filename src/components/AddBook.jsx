import { useState } from "react";
import BookForm from "./BookForm";
import BookCoverAIRequest from "./BookCoverAIRequest";

// App.jsx 하위 부모 컴포넌트 - 책 신규 작성/등록 페이지
function AddBook({ onTransform, onSubmit }) {

    const [newBook, setNewBook] = useState({
        id: null,
        title: "",
        author: "",
        content: "",
        category: "",
        coverImageUrl: "",
        createdAt: null,
        updatedAt: null
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
        if (!newBook.category) {
            alert("카테고리는 필수 선택 사항입니다.");
            return;
        }
        if (!newBook.content) {
            alert("내용은 필수 입력 사항입니다.");
            return;
        }
        onSubmit(newBook);
    };

    return (
        <div className="form-page-container">
            <h1>책 신규 작성/등록</h1>
            <BookForm
                book={newBook}
                onFieldChange={handleFieldChange}
            />
            <BookCoverAIRequest book={newBook} onFieldChange={handleFieldChange} />
            <div className="button-group">
                <button type="button" onClick={handleSubmit} className="submit-button">
                    등록
                </button>
                <button type="button" onClick={() => onTransform("list", null)} className="cancel-button">
                    취소
                </button>
            </div>
        </div>
    );
}

export default AddBook;