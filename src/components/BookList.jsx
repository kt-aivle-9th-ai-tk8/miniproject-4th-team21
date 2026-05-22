import BookItem from './BookItem';

function BookList({books, onDelete, onTransform}) {
    return (
        <div className='list-container'>
            <header className='list-header'>
                <div>
                    <h1>도서 목록</h1>
                    <p>현재 등록된 전체 도서를 확인하고 관리합니다.</p>
                </div>
                <button className='add-btn'>도서 등록</button>
            </header>

            <ul className="book-list">
                {books.map(b => (
                    <BookItem 
                        key={b.id}
                        id={b.id}
                        title={b.title}
                        author={b.author}
                        content={b.content}
                        coverImageUrl={b.coverImageUrl}
                        createdAt={b.createdAt}
                        onDelete={onDelete}
                        onTransform={onTransform}
                    />
                ))}
            </ul>
        </div>
    );
}

export default BookList