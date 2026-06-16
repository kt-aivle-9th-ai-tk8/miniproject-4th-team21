import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchBookById, deleteBook } from '../api/bookApi';
import { useServerRequest } from '../hooks/useServerRequest';

function RemoveBook() {
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
                handleServerError(loadBook);
            } else {
                clearStatus();
                navigate('/error');
            }
        });
    };

    useEffect(() => { loadBook(); }, [id]);

    const handleConfirmDelete = async () => {
        startLoading();
        const res = await deleteBook(Number(id));
        if (res.success) {
            clearStatus();
            navigate('/books');
        } else if (res.status === 404) {
            clearStatus();
            navigate('/error/not-found');
        } else if (res.errorType === 'NETWORK_ERROR' || res.errorType === 'SERVER_ERROR') {
            handleServerError(handleConfirmDelete); // retry 기작은 자기자신
        } else {
            clearStatus();
            navigate('/error');
        }
    };

    if (!book) return overlay;

    return (
        <>
        {overlay}
        <div className="modal-overlay">
            <div className="remove-container">
                <h2>도서 삭제 확인</h2>
                <p>정말 <span>{book.title}</span> ({book.author} 저)을(를) 삭제하시겠습니까?</p>
                <div className="btn-group">
                    <button onClick={handleConfirmDelete}>확인</button>
                    <button onClick={() => navigate(-1)}>취소</button>
                </div>
            </div>
        </div>
        </>
    );
}

export default RemoveBook;
