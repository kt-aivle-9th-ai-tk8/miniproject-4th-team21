export default function ViewBook({ book, onTransform }) {
  if (!book) {
    onTransform('unavailable', null);
    return null;
  }

  // 날짜 (BookItem.jsx에서 복사)
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  return (
    <div className="viewbook-container">
      {/* 뒤로가기 */}
      <div className="viewbook-header-bar">
        <button className="btn-secondary" onClick={() => onTransform('list', null)}>목록으로 돌아가기</button>
      </div>

      {/* 제목 */}
      <h1 className="viewbook-page-title">도서 상세 정보</h1>

      {/* 사진과 내용 */}
      <div className="viewbook-card">
        <div className="viewbook-cover-wrapper">
          {book.coverImageUrl ? (
            <img src={book.coverImageUrl} alt={book.title} />
          ) : (
            <span className="no-cover-image">이미지 없음</span>
          )}
        </div>

        <div className="viewbook-info">
          <h2 className="viewbook-title">{book.title}</h2>
          <p className="viewbook-author">{book.author} 저</p>
          
          <div className="viewbook-details-grid">
            <p className="viewbook-details-item" >등록일: {formatDate(book.createdAt)}</p>
            <p className="viewbook-details-item">수정일: {formatDate(book.updatedAt)}</p>
          </div>
          
          <h3 className="viewbook-content-title">도서 소개</h3>
          <p className="viewbook-content-body">{book.content}</p>

          {/* 하단 화면 */}
          <div className="viewbook-action">
            <button className="btn-danger" onClick={() => onTransform('remove', book.id)}>도서삭제</button>
            <button className="btn-primary" onClick={() => onTransform('edit', book.id)}>정보 수정</button>
          </div>
        </div>
      </div>
    </div>
  );
}