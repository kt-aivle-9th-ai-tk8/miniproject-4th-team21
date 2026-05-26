function RemoveBook({book, onDelete, onTransform, prevPage}) {
    // book 데이터 못 받거나 로딩 필요할 때
    if (!book) {
        return (
            <div className="remove-container">
                <p>도서 정보를 불러오는 중입니다...</p>
                <button onClick={() => onTransform('list')}>목록으로 돌아가기</button>
            </div>
        );
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