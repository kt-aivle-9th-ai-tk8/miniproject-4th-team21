import { useState } from "react";
// 기존 AI 생성기 컴포넌트 그대로 사용 (수정 불필요)
import BookCoverAIRequest from "./BookCoverAIRequest"; 

export default function ViewBook({ book, onTransform, setBooks }) {
  const [isAiMode, setIsAiMode] = useState(false); 
  const [isPatching, setIsPatching] = useState(false); 

  // 상세 페이지 전용 임시 내용 입력 상태 추가 (초기값은 현재 책의 내용)
  const [tempContent, setTempContent] = useState(book?.content || "");

  if (!book) {
    onTransform('unavailable', null);
    return null;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // AI 표지가 성공적으로 생성되었을 때 호출되는 백엔드 PATCH 콜백
  const handleAiCoverGenerated = async (updatedBookWithImage) => {
    setIsPatching(true);
    try {
      const response = await fetch(`http://localhost:8080/books/${book.id}/cover`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // 표지 & 일회성 내용 전달 -> 표지만 바뀌도록
          coverImageUrl: updatedBookWithImage.coverImageUrl
        }),
      });

      if (response.ok) {
        const finalBook = await response.json();
        alert("생성된 AI 표지가 최종 반영되었습니다!");
        setBooks(prev => prev.map(b => b.id === finalBook.id ? finalBook : b));
        onTransform('list', book.id);   
      } else {
        alert("표지를 저장하는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("PATCH 요청 중 오류 발생:", error);
      alert("서버 통신 오류가 발생했습니다.");
    } finally {
      setIsPatching(false);
    }
  };

  // 원래 book 정보에 사용자가 새로 쓴 tempContent만 덮어씌운 가짜 객체를 만들기
  const modifiedBookForAi = {
    ...book,
    content: tempContent
  };

  return (
    <div className="viewbook-container">
      <div className="viewbook-header-bar">
        <button className="btn-secondary" onClick={() => onTransform('list', null)} disabled={isPatching}>목록으로 돌아가기</button>
      </div>

      <h1 className="viewbook-page-title">도서 상세 정보</h1>

      <div className="viewbook-card">
        <div className="viewbook-cover-wrapper">
          {book.coverImageUrl ? (
            <img src={book.coverImageUrl} alt={book.title} />
          ) : (
            <span className="no-cover-image">이미지 없음</span>
          )}
          {isPatching && <div className="cover-loading-overlay">저장 중...</div>}
        </div>

        <div className="viewbook-info">
          <h2 className="viewbook-title">{book.title}</h2>
          <p className="viewbook-author">{book.author} 저</p>
          
          <div className="viewbook-details-grid">
            <p className="viewbook-details-item" >등록일: {formatDate(book.createdAt)}</p>
            <p className="viewbook-details-item">수정일: {formatDate(book.updatedAt)}</p>
          </div>
          
          <h3 className="viewbook-content-title">도서 소개</h3>
          <p className="viewbook-content-body">{book.content}</p>

          <div className="viewbook-action">
            <button className="btn-danger" onClick={() => onTransform('remove', book.id)} disabled={isPatching}>도서삭제</button>
            
            <button 
              className="btn-ai-toggle" 
              onClick={() => setIsAiMode(!isAiMode)} 
              disabled={isPatching}
            >
              {isAiMode ? "표지 생성 취소" : "AI 표지 변경"}
            </button>

            <button className="btn-primary" onClick={() => onTransform('edit', book.id)} disabled={isPatching}>정보 수정</button>
          </div>
          {/* 상세 페이지 토글 영역에만 텍스트 입력창과 AI 컴포넌트를 나란히 배치 */}
          {isAiMode && (
            <div className="viewbook-ai-request-wrapper">
              
              {/* 상세페이지 전용 피드백 입력란 */}
              <div className="viewbook-textarea-group">
                <label className="viewbook-textarea-label">표지 생성을 위한 도서 내용 수정</label>
                <textarea
                  className="viewbook-feedback-textarea"
                  rows="4"
                  value={tempContent}
                  onChange={(e) => setTempContent(e.target.value)}
                  disabled={isPatching}
                  placeholder="내용을 수정하면 새로운 표지를 그려냅니다."
                />
              </div>

              {/* 기존 AI 컴포넌트 호출 */}
              <BookCoverAIRequest 
                book={modifiedBookForAi} 
                onFieldChange={handleAiCoverGenerated} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}