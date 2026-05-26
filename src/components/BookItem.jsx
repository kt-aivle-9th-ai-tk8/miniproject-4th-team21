function BookItem({ id, title, author, coverImageUrl, createdAt, onTransform }) {
    // 목록에서 삭제
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onTransform('remove', id);
    }

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

        <div className="book-actions">
            <button className="delete-btn" onClick={handleDeleteClick}>삭제</button>
        </div>
    </li>
  );
}

export default BookItem;