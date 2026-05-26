function Header({ onTransform, currentPage }) {
  // 스타일은 App.css의 .site-header / .nav-btn 클래스로 분리
  // 현재 페이지인 버튼은 'active' 클래스로 하이라이트(진한 파란색) 처리

  return (
    <header className="site-header">
      {/* 로고 영역: 클릭 시 규칙대로 메인 목록으로 전환 */}
      <h2
        className="header-logo"
        onClick={() => onTransform('list', null)}
      >
        📘 도서 관리 시스템
      </h2>

      <nav className="header-nav">
        <button
          className={`nav-btn${currentPage === 'list' ? ' active' : ''}`}
          onClick={() => onTransform('list', null)}
        >
          도서 목록
        </button>


        <button
          className={`nav-btn nav-btn-add${currentPage === 'add' ? ' active' : ''}`}
          onClick={() => onTransform('add', null)}
        >
          새 도서 등록
        </button>
      </nav>
    </header>
  );
}

export default Header;
