import { CATEGORY_OPTIONS } from '../constants/categoryOptions';

const BOOK_CATEGORY_BADGE_CSS = `
.book-category-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: 0.2px;
    margin-bottom: 8px;
    white-space: nowrap;
}
/* CATEGORIES 배열 순서(빨주노초파남보 흐름) */
.book-category-badge--0 { background-color: #e63946; color: #ffffff; } /* 소설 */
.book-category-badge--1 { background-color: #f4a261; color: #1a1a1a; } /* 시/에세이 */
.book-category-badge--2 { background-color: #ffd166; color: #1a1a1a; } /* 인문 */
.book-category-badge--3 { background-color: #2a9d8f; color: #ffffff; } /* 사회/경제 */
.book-category-badge--4 { background-color: #1d4ed8; color: #ffffff; } /* 공학/기술 */
.book-category-badge--5 { background-color: #5a4fcf; color: #ffffff; } /* 컴퓨터/IT */
.book-category-badge--6 { background-color: #8d99ae; color: #ffffff; } /* 기타 */
.book-category-badge--unknown { background-color: #cbd5e1; color: #1a1a1a; }
`;

function BookItem({ id, title, author, category, coverImageUrl, createdAt, updatedAt, onTransform }) {
    // 목록에서 삭제
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onTransform('remove', id);
    }

    // 날짜 표시 보정: ISO("2023-01-01T00:00:00Z")이든 toLocaleString 결과이든 YYYY-MM-DD로 통일
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr; // 파싱 실패 시 원본 그대로
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    // 카테고리 → 배지 색상 클래스 (CATEGORIES 배열 내 index 기반)
    const categoryIndex = CATEGORY_OPTIONS.indexOf(category);
    const categoryBadgeClass = categoryIndex >= 0
        ? `book-category-badge book-category-badge--${categoryIndex}`
        : 'book-category-badge book-category-badge--unknown';

  return (
    <li className="book-card"
        onClick={() => onTransform('view', id)} // 버튼X, 카드 어디든 누르면 상세보기로 이동
    >
        {/* CSS 담당자가 App.css로 옮긴 뒤 이 줄은 삭제하면 됩니다 */}
        <style>{BOOK_CATEGORY_BADGE_CSS}</style>

        <div className="book-image">
            {coverImageUrl && (
            <img src={coverImageUrl} alt={title} />
            )}
        </div>

        <div className="book-info">
            {category && (
                <span className={categoryBadgeClass}>{category}</span>
            )}
            <h3>{title}</h3>
            <p className="book-author">{author}</p>

            <hr className="book-divider" />

            {/* 등록일과 수정일을 라벨/값 형태로 표시 (디자인 샘플 기준) */}
            <div className="book-dates">
                <div className="book-date-row">
                    <span className="book-date-label">등록일</span>
                    <span className="book-date-value">{formatDate(createdAt)}</span>
                </div>
                {updatedAt && (
                    <div className="book-date-row">
                        <span className="book-date-label">수정일</span>
                        <span className="book-date-value">{formatDate(updatedAt)}</span>
                    </div>
                )}
            </div>
        </div>

        <div className="book-actions">
            <button className="delete-btn" onClick={handleDeleteClick}>삭제</button>
        </div>
    </li>
  );
}

export default BookItem;
