export default function ViewBook({ book, onTransform }) {
  if (!book) return null;

  // 날짜 생성 (BookItem.jsx에서 복사)
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
    <div>
      {/* 1. 뒤로가기 */}
      <div>
        <button onClick={() => onTransform('list')}>목록으로 돌아가기</button>
      </div>

      {/* 2. 제목 */}
      <h1>도서 상세 정보</h1>

      {/* 3. 사진과 상세 정보 */}
      <div>
        <div>
          {book.coverImageUrl ? (
            <img src={book.coverImageUrl} alt={book.title} />
          ) : (
            <span>이미지 없음</span>
          )}
        </div>

        <div>
          <h2>{book.title}</h2>
          <p>{book.author} 저</p>
          <p>등록일: {formatDate(book.createdAt)}</p>
          
          <h3>도서 소개</h3>
          <p>{book.content}</p>

          {/* 하단 화면 */}
          <div>
            <button onClick={() => onTransform('remove', book.id)}>도서삭제</button>
            <button onClick={() => onTransform('edit', book.id)}>정보 수정</button>
          </div>
        </div>
      </div>
    </div>
  );
}