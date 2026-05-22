import React from 'react';

function BookForm({ form, onChange, mode }) {
    const containerStyle = {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #e0e0e0',
        fontFamily: 'sans-serif'
    };

    const gridStyle = {
        display: 'flex',
        gap: '20px',
        marginBottom: '15px',
        flexWrap: 'wrap'
    };

    const itemStyle = {
        flex: '1',
        minWidth: '200px'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '14px',
        marginBottom: '5px',
        fontWeight: 'bold'
    };

    const inputStyle = {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box'
    };

    return (
        <div style={containerStyle}>
            <div style={gridStyle}>
                <div style={itemStyle}>
                    <label style={labelStyle}>도서명 <span style={{ color: 'red' }}>*</span></label>
                    <input
                        type="text"
                        style={inputStyle}
                        placeholder="예: 클린 코드"
                        value={form.title}
                        onChange={onChange('title')}
                        required
                    />
                </div>
                <div style={itemStyle}>
                    <label style={labelStyle}>저자 <span style={{ color: 'red' }}>*</span></label>
                    <input
                        type="text"
                        style={inputStyle}
                        placeholder="예: 로버트 C. 마틴"
                        value={form.author}
                        onChange={onChange('author')}
                        required
                    />
                </div>
            </div>
            <div style={{ width: '100%' }}>
                <label style={labelStyle}>상세 설명</label>
                <textarea
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    placeholder="도서에 대한 간단한 요약이나 설명을 입력하세요."
                    value={form.content}
                    onChange={onChange('content')}
                />
            </div>
        </div>
    );
}

export default BookForm;

