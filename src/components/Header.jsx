function Header({ onTransform, currentPage }) {
  
  const currentPage = 'helloworld';
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
        onClick={() => onTransform('list', null)} 
        style={{ margin: 0, cursor: 'pointer' }}
      >
        📘 도서 관리 시스템
      </h2>

      <nav>
        <button 
          style={buttonStyle('list')} 
          onClick={() => onTransform('list', null)}
        >
          도서 목록
        </button>
        
        
        <button 
          style={{ ...buttonStyle('add'), backgroundColor: currentPage === 'add' ? '#c2185b' : '#E91E63' }} 
          onClick={() => onTransform('add', null)}
        >
          새 도서 등록
        </button>
      </nav>
    </header>
  );
}

export default Header;