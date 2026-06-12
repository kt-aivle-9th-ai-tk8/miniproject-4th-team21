import { useState } from 'react';
import BookItem from './BookItem';
import { CATEGORY_OPTIONS } from '../constants/categoryOptions';

const SEARCH_FIELDS = [
    { value: 'all', label: '통합검색' },
    { value: 'title', label: '도서명' },
    { value: 'author', label: '저자명' },
];

function BookList({books, onTransform, onSearch}) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchType, setSearchType] = useState('all');
    const [searchKeyword, setSearchKeyword] = useState('');

    // 필터링: 카테고리 + (선택된 필드에 대한 키워드 부분일치) -> 백엔드 연동
    //const keyword = searchKeyword.trim().toLowerCase();
   /*const filteredBooks = books.filter(b => {
        const matchCategory = !selectedCategory || b.category === selectedCategory;

        if (!keyword) return matchCategory;

        const title = (b.title ?? '').toLowerCase();
        const author = (b.author ?? '').toLowerCase();
        const matchKeyword =
            searchField === 'title'  ? title.includes(keyword)  :
            searchField === 'author' ? author.includes(keyword) :
            /*all                  title.includes(keyword) || author.includes(keyword);

        return matchCategory && matchKeyword;
    });*/
    
    // 검색 버튼 & 엔터
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        
        // 백엔드 조회 요청
        onSearch({
            category: selectedCategory,
            searchType: searchType,
            keyword: searchKeyword.trim()
        });
    };
    
    return (
        <div className='list-container'>
            <header className='list-header'>
                <div>
                    <h1>도서 목록</h1>
                    <p>현재 등록된 전체 도서를 확인하고 관리합니다.</p>
                </div>
            </header>

            <form className="book-filters" onSubmit={handleSearchSubmit}>
                <select
                    className="filter-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">전체 카테고리</option>
                    {CATEGORY_OPTIONS.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    className="filter-select"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                >
                    {SEARCH_FIELDS.map(f => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
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
                            onTransform={onTransform}
                        />
                    ))
                )}
            </ul>
        </div>
    );
}

export default BookList;
