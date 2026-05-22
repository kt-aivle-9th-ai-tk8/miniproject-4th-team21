import React from 'react';


function Header({ setView, view }) {
  return (
    <header style={{
      backgroundColor: '#0056b3',    
      color: '#ffffff',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* 로고 영역: 클릭하면 메인 리스트로 돌아갑니다. */}
      <div 
        onClick={() => setView('list')} 
        style={{ fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <span>📘 도서 관리 시스템</span>
      </div>

      {/* 우측 네비게이션 버튼 영역 */}
      <nav style={{ display: 'flex', gap: '12px' }}>
        <button 
          onClick={() => setView('list')}
          style={{
            backgroundColor: view === 'list' ? '#003d82' : 'transparent', 
            color: '#ffffff',
            border: '1px solid #ffffff',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          도서 목록
        </button>
        <button 
          onClick={() => setView('add')}
          style={{
            backgroundColor: '#E91E63', 
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
          }}
        >
          새 도서 등록
        </button>
      </nav>
    </header>
  );
}

export default Header;