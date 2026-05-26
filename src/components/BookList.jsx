import BookItem from './BookItem';

function BookList({books, onTransform}) {
    return (
        <div className='list-container'>
            <header className='list-header'>
                <div>
                    <h1>도서 목록</h1>
                    <p>현재 등록된 전체 도서를 확인하고 관리합니다.</p>
                </div>
            </header>

            <ul className="book-list">
                {books.length > 0 ? (
                    books.map(b => (
                        <BookItem 
                            key={b.id}
                            id={b.id}
                            title={b.title}
                            author={b.author}
                            coverImageUrl={b.coverImageUrl}
                            createdAt={b.createdAt}
                            onTransform={onTransform}
                        />
                    ))
                ) : (
                    <p>등록된 도서가 없습니다.</p>
                )}
            </ul>
        </div>
    );
}

export default BookList;