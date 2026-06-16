import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BookForm from "./BookForm";
import BookCoverAIRequest from "./BookCoverAIRequest";
import { fetchBookById, updateBook } from "../api/bookApi";
import UnavailableBackend from "./UnavailableBackend";

function EditBook() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [serverError, setServerError] = useState(false);

    const loadBook = () => {
        setServerError(false);
        fetchBookById(id).then(res => {
            if (res.success) {
                setBook(res.data);
            } else if (res.status === 404) {
                navigate('/error/not-found');
            } else if (res.errorType === 'NETWORK_ERROR' || res.errorType === 'SERVER_ERROR') {
                setServerError(true);
            } else {
                navigate('/error');
            }
        });
    };

    useEffect(() => { loadBook(); }, [id]);

    const handleFieldChange = (updatedBook) => setBook(updatedBook);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!book.title || !book.author) {
            alert("제목과 저자는 필수 입력 사항입니다.");
            return;
        }
        if (!book.category) {
            alert("카테고리는 필수 선택 사항입니다.");
            return;
        }
        const res = await updateBook(Number(id), book);
        if (res.success) {
            navigate(`/books/${res.data.id}`);
        } else if (res.status === 404) {
            navigate('/error/not-found');
        } else if (res.errorType === 'NETWORK_ERROR' || res.errorType === 'SERVER_ERROR') {
            setServerError(true);
        } else {
            navigate('/error');
        }
    };

    if (serverError) return <UnavailableBackend onRetry={() => book ? setServerError(false) : loadBook()} />;
    if (!book) return <p className="status-text">불러오는 중...</p>;

    return (
        <div className="form-page-container">
            <h1>책 내용 수정</h1>
            <BookForm book={book} onFieldChange={handleFieldChange} />
            <BookCoverAIRequest book={book} onFieldChange={handleFieldChange} />
            <div className="button-group">
                <button type="button" onClick={handleSubmit} className="submit-button">등록</button>
                <button type="button" onClick={() => navigate(-1)} className="cancel-button">취소</button>
            </div>
        </div>
    );
}

export default EditBook;
