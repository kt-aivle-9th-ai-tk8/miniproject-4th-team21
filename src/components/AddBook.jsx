import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookForm from "./BookForm";
import BookCoverAIRequest from "./BookCoverAIRequest";
import { createBook } from "../api/bookApi";
import UnavailableBackend from "./UnavailableBackend";

function AddBook() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newBook.title || !newBook.author) {
            alert("제목과 저자는 필수 입력 사항입니다.");
            return;
        }
        if (!newBook.category) {
            alert("카테고리는 필수 선택 사항입니다.");
            return;
        }
        if (!newBook.content.trim()) {
            alert("내용은 필수 입력 사항입니다.");
            return;
        }
        const res = await createBook(newBook);
        if (res.success) {
            navigate(`/books/${res.data.id}`);
        } else if (res.errorType === 'NETWORK_ERROR' || res.errorType === 'SERVER_ERROR') {
            setServerError(true);
        } else {
            navigate('/error');
        }
    };

    return (
        <div className="form-page-container">
            {serverError && <UnavailableBackend onRetry={() => setServerError(false)} />}
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
                <button type="button" onClick={() => navigate('/books')} className="cancel-button">
                    취소
                </button>
            </div>
        </div>
    );
}

export default AddBook;