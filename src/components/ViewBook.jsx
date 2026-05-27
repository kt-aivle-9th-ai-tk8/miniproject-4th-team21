export default function ViewBook({ book, onTransform }) {

  return (
    <div>
      {/* 1. 도서 리스트로 이동 버튼 */}
      <button onClick={() => onTransform('list')}>
        도서 리스트로 이동 버튼
      </button>

      {/* 2. 도서 상세 정보 영역 */}
      <div>
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt={book.title} />
        ) : (
          <span>이미지 없음</span>
        )}
        <h2>{book.title}</h2>
        <p>{book.author}</p>
        <p>{book.createdAt}</p>
        <p>{book.content}</p>
      </div>

      <div>
        {/* 도서 수정 페이지로 이동 */}
        <button onClick={() => onTransform('edit', book.id)}>
          도서 수정
        </button>
        {/* 도서 삭제 페이지로 이동 */}
        <button onClick={() => onTransform('remove', book.id)}>
          도서 삭제
        </button>
      </div>
    </div>
  );
}