import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BookForm from "./BookForm";
import BookCoverAIRequest from "./BookCoverAIRequest";
import { fetchBookById, updateBook } from "../api/bookApi";
import { useServerRequest } from "../hooks/useServerRequest";

function EditBook() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { startLoading, handleServerError, clearStatus, overlay } = useServerRequest();
    const [book, setBook] = useState(null);

    const loadBook = () => {
        startLoading();
        fetchBookById(id).then(res => {
            if (res.success) {
                clearStatus();
                setBook(res.data);
            } else if (res.status === 404) {
                clearStatus();
                navigate('/error/not-found');
            } else if (res.errorType === 'NETWORK_ERROR' || res.errorType === 'SERVER_ERROR') {
                handleServerError(loadBook); // retry 기작은 자기자신
            } else {
                clearStatus();
                navigate('/error');
            }
        });
    };

    useEffect(() => { loadBook(); }, [id]);

    const handleFieldChange = (updatedBook) => setBook(updatedBook);

    const submitBook = async () => {
        startLoading();
        const res = await updateBook(Number(id), book);
        if (res.success) {
            clearStatus();
            navigate(`/books/${res.data.id}`);
        } else if (res.status === 404) {
            clearStatus();
            navigate('/error/not-found');
        } else if (res.errorType === 'NETWORK_ERROR' || res.errorType === 'SERVER_ERROR') {
            handleServerError(submitBook); // 수정 내용은 book state에 유지되므로 동일 내용으로 재시도
        } else {
            clearStatus();
            navigate('/error');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!book.title || !book.author) { alert("제목과 저자는 필수 입력 사항입니다."); return; }
        if (!book.category) { alert("카테고리는 필수 선택 사항입니다."); return; }
        if (!book.content.trim()) { alert("내용은 필수 입력 사항입니다."); return; }
        submitBook();
    };

    if (!book) return overlay;

    return (
        <>
        {overlay}
        <div className="form-page-container">
            <h1>책 내용 수정</h1>
            <BookForm book={book} onFieldChange={handleFieldChange} />
            <BookCoverAIRequest book={book} onFieldChange={handleFieldChange} />
            <div className="button-group">
                <button type="button" onClick={handleSubmit} className="submit-button">등록</button>
                <button type="button" onClick={() => navigate(-1)} className="cancel-button">취소</button>
            </div>
        </div>
        </>
    );
}

export default EditBook;
