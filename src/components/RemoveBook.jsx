import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchBookById, deleteBook } from '../api/bookApi';
import UnavailableBackend from './UnavailableBackend';

function RemoveBook() {
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

    const handleConfirmDelete = async () => {
        const res = await deleteBook(Number(id));
        if (res.success) {
            navigate('/books');
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
    );
}

export default RemoveBook;
