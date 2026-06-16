import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookItem from './BookItem';
import { CATEGORY_OPTIONS } from '../constants/categoryOptions';
import { fetchBooks } from '../api/bookApi';
import { useServerRequest } from '../hooks/useServerRequest';

const SEARCH_FIELDS = [
    { value: 'all', label: '통합검색' },
    { value: 'title', label: '도서명' },
    { value: 'author', label: '저자명' },
];

function BookList() {
    const navigate = useNavigate();
    const { startLoading, handleServerError, clearStatus, overlay } = useServerRequest();
    const [books, setBooks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchType, setSearchType] = useState('all');
    const [searchKeyword, setSearchKeyword] = useState('');

    const loadBooks = async (filterData = null) => {
        startLoading();
        const res = await fetchBooks(filterData);
        if (res.success) {
            clearStatus();
            setBooks(Array.isArray(res.data) ? res.data : []);
        } else if (res.errorType === 'NETWORK_ERROR' || res.errorType === 'SERVER_ERROR') {
            handleServerError(() => loadBooks(filterData)); // retry 기작은 자기자신
        } else {
            clearStatus();
            navigate('/error');
        }
    };

    useEffect(() => { loadBooks(); }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        loadBooks({ category: selectedCategory, searchType, keyword: searchKeyword.trim() });
    };

    return (
        <>
        {overlay}
        <div className='list-container'>
            <header className='list-header'>
                <div>
                    <h1>도서 목록</h1>
                    <p>현재 등록된 전체 도서를 확인하고 관리합니다.</p>
                </div>
            </header>

            <form className="book-filters" onSubmit={handleSearchSubmit}>
                <select className="filter-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">전체 카테고리</option>
                    {CATEGORY_OPTIONS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                <select className="filter-select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                    {SEARCH_FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>

                <input
                    type="text"
                    className="filter-input"
                    placeholder="검색어를 입력하세요"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button type="submit" className="search-button">검색</button>
            </form>

            <ul className="book-list">
                {books.length === 0 ? (
                    <p>등록된 도서가 없습니다.</p>
                ) : (
                    books.map(b => (
                        <BookItem
                            key={b.id}
                            id={b.id}
                            title={b.title}
                            author={b.author}
                            category={b.category}
                            coverImageUrl={b.coverImageUrl}
                            createdAt={b.createdAt}
                            updatedAt={b.updatedAt}
                        />
                    ))
                )}
            </ul>
        </div>
        </>
    );
}

export default BookList;
