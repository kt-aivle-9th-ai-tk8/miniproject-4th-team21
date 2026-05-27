// App.jsx 하위 부모 컴포넌트 - 임시저장 목록 페이지
// drafts: bookId === null 은 신규 등록 임시본 / 정수면 해당 book.id 의 수정 임시본
function DraftList({ drafts, books, onTransform, onDraftDelete }) {

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mi = String(d.getMinutes()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
    };

    // 신규/수정 진입 라우팅: selectedBookId 슬롯에 신규는 draft.id, 수정은 draft.bookId 적재 (overloading 허용)
    const handleContinue = (draft) => {
        if (draft.bookId == null) {
            onTransform('add', draft.id);
        } else {
            onTransform('edit', draft.bookId);
        }
    };

    const handleDelete = (draft) => {
        if (!confirm('이 임시저장본을 삭제할까요?')) return;
        onDraftDelete(draft.id);
    };

    const renderTypeBadge = (draft) => {
        if (draft.bookId == null) {
            return <span className="draft-type-badge draft-type-new">신규</span>;
        }
        const linkedBook = books.find(b => b.id === draft.bookId);
        const linkedTitle = linkedBook?.title ?? `삭제된 도서 (id=${draft.bookId})`;
        return <span className="draft-type-badge draft-type-edit">수정: {linkedTitle}</span>;
    };

    return (
        <div className="list-container">
            <header className="list-header">
                <div>
                    <h1>임시저장 목록</h1>
                    <p>작성 중 저장해둔 도서 등록/수정 임시본을 관리합니다.</p>
                </div>
            </header>

            <ul className="draft-list">
                {drafts.length === 0 ? (
                    <p>임시저장된 항목이 없습니다.</p>
                ) : (
                    drafts.map(d => (
                        <li key={d.id} className="draft-list-item">
                            <div className="draft-item-meta">
                                {renderTypeBadge(d)}
                                <span className="draft-item-date">최근 저장: {formatDate(d.updatedAt)}</span>
                            </div>

                            <div className="draft-item-body">
                                <h3 className="draft-item-title">{d.title || <em>(제목 없음)</em>}</h3>
                                <p className="draft-item-author">{d.author || <em>(저자 없음)</em>}</p>
                                {d.category && (
                                    <p className="draft-item-category">카테고리: {d.category}</p>
                                )}
                            </div>

                            <div className="draft-item-actions">
                                <button
                                    type="button"
                                    className="draft-continue-button"
                                    onClick={() => handleContinue(d)}
                                >
                                    {d.bookId == null ? '계속작성' : '계속수정'}
                                </button>
                                <button
                                    type="button"
                                    className="draft-delete-button"
                                    onClick={() => handleDelete(d)}
                                >
                                    삭제하기
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default DraftList;
