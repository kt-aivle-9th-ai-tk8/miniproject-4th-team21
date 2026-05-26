import { useEffect } from "react";

function RemoveBook({book, onDelete, onTransform, prevPage}) {
    // book 데이터 없을 때
    if (book === null || book === undefined) {
        onTransform('unavailable');
        return null;
    }

    // 삭제 확인 시 '확인' 눌렀을 때
    const handleConfirmDelete = () => {
        if (book) {
            onDelete(book.id);
        }
    };

    // '취소' 버튼 눌렀을 때
    const handleCancel = () => {
        if (prevPage === 'view') {
            // 상세 페이지
            onTransform('view', book.id);
        } else {
            // 도서 목록
            onTransform('list');
        }
    };

    return (
       <div className="modal-overlay">
            <div className="remove-container">
                <h2>도서 삭제 확인</h2>
                <p>정말 <span>{book?.title}</span> ({book?.author} 저)을(를) 삭제하시겠습니까?</p>

                <div className="btn-group">
                    <button onClick={handleConfirmDelete}>확인</button>
                    <button onClick={handleCancel}>취소</button>
                </div>
            </div>
       </div>  
    );
}

export default RemoveBook;