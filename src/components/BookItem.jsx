function BookItem({ id, title, author, coverImageUrl, createdAt, onTransform }) {
  return (
    <li className="book-card"
        onClick={() => onTransform('view', id)} // 버튼X, 카드 어디든 누르면 상세보기로 이동
    >

        <div className="book-image">
            {coverImageUrl && (
            <img src={coverImageUrl} alt={title} style={{ width: '100px', height: 'auto' }} />
            )}
        </div>

        <div className="book-info">
            <h3>{title}</h3>
            <p>{author}</p>
            <p>등록일: {createdAt}</p>
        </div>
    </li>
  );
}

export default BookItem;