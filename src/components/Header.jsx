// src/components/Header.jsx
import React from 'react';

// [개념 연결]: 부모(App.jsx)로부터 화면 전환용 무전기 'onTransform'과 
// 현재 불빛을 켤 위치를 알기 위해 'currentPage'를 props로 수령합니다.
function Header({ onTransform, currentPage }) {
  
  // 가이드라인에 정의된 신뢰감을 주는 파란색 테마 스타일링
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    backgroundColor: '#0056b3', // 메인 파란색
    color: '#ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const buttonStyle = (pageName) => ({
    padding: '8px 16px',
    // 현재 보고 있는 페이지 버튼이면 더 진한 파란색으로 하이라이트(Active) 처리
    backgroundColor: currentPage === pageName ? '#003d82' : 'transparent',
    color: '#ffffff',
    border: '1px solid #ffffff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    marginLeft: '10px',
    transition: 'all 0.2s ease'
  });

  return (
    <header style={headerStyle}>
      {/* 로고 영역: 클릭 시 규칙대로 메인 목록으로 전환 */}
      <h2 
        onClick={() => onTransform('도서목록', null)} 
        style={{ margin: 0, cursor: 'pointer' }}
      >
        📘 도서 관리 시스템
      </h2>

      <nav>
        {/* ⭐ [코드 연결 포인트 1]: 도서 목록 버튼 클릭 시 */}
        {/* 규격인 인자 ('도서목록', null)를 정확히 매개변수로 실어 보냅니다. */}
        <button 
          style={buttonStyle('도서목록')} 
          onClick={() => onTransform('도서목록', null)}
        >
          도서 목록
        </button>
        
        
        <button 
          style={{ ...buttonStyle('도서등록'), backgroundColor: currentPage === '도서등록' ? '#c2185b' : '#E91E63' }} 
          onClick={() => onTransform('도서등록', null)}
        >
          새 도서 등록
        </button>
      </nav>
    </header>
  );
}

export default Header;