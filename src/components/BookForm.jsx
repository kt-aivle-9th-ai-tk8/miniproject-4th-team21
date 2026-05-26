import React from 'react';

function BookForm({ book, onFieldChange }) {
    const handleChange = (field) => (e) => {
        onFieldChange({
            ...book,
            [field]: e.target.value
        });
    };

    // 스타일은 App.css의 .book-form-card / .form-row / .form-input 클래스로 분리

    return (
        <div className="book-form-card">
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">도서명 <span className="required">*</span></label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="예: 도서명을 입력하세요"
                        value={book.title}
                        onChange={handleChange('title')}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">저자 <span className="required">*</span></label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="예: 저자를 입력하세요"
                        value={book.author}
                        onChange={handleChange('author')}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">상세 설명</label>
                <textarea
                    className="form-input form-textarea"
                    placeholder="도서에 대한 간단한 요약이나 설명을 입력하세요."
                    value={book.content}
                    onChange={handleChange('content')}
                />
            </div>
        </div>
    );
}

export default BookForm;
