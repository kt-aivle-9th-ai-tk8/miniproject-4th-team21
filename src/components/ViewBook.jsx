import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BookCoverAIRequest from "./BookCoverAIRequest";
import { fetchBookById, updateBookCover } from "../api/bookApi";
import UnavailableBackend from "./UnavailableBackend";

export default function ViewBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [serverError, setServerError] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);
  const [isPatching, setIsPatching] = useState(false);
  const [tempContent, setTempContent] = useState("");

  const loadBook = () => {
    setServerError(false);
    fetchBookById(id).then(res => {
      if (res.success) {
        setBook(res.data);
      } else if (res.status === 404) {
        navigate('/error/not-found');
      } else if (res.errorType === 'NETWORK_ERROR' || res.errorType === 'SERVER_ERROR') {
        setServerError(true);
      } else {
        navigate('/error');
      }
    });
  };

  useEffect(() => { loadBook(); }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleAiCoverGenerated = async (updatedBookWithImage) => {
    setIsPatching(true);
    const res = await updateBookCover(Number(id), updatedBookWithImage.coverImageUrl);
    if (res.success) {
      alert("생성된 AI 표지가 최종 반영되었습니다!");
      setBook(res.data);
      setIsAiMode(false);
    } else if (res.status === 404) {
      navigate('/error/not-found');
    } else if (res.errorType === 'NETWORK_ERROR' || res.errorType === 'SERVER_ERROR') {
      setServerError(true);
    } else {
      alert("표지를 저장하는 데 실패했습니다.");
      navigate('/error');
    }
    setIsPatching(false);
  };

  if (serverError) return <UnavailableBackend onRetry={() => book ? setServerError(false) : loadBook()} />;
  if (!book) return <p className="status-text">불러오는 중...</p>;

  const modifiedBookForAi = {
    ...book,
    content: tempContent.trim() ? tempContent : `도서 제목: "${book.title}". 줄거리 및 분위기: ${book.content}`
  };

  return (
    <div className="viewbook-container">
      <div className="viewbook-header-bar">
        <button className="btn-secondary" onClick={() => navigate('/books')} disabled={isPatching}>목록으로 돌아가기</button>
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
            <p className="viewbook-details-item">등록일: {formatDate(book.createdAt)}</p>
            <p className="viewbook-details-item">수정일: {formatDate(book.updatedAt)}</p>
          </div>

          <h3 className="viewbook-content-title">도서 소개</h3>
          <p className="viewbook-content-body">{book.content}</p>

          <div className="viewbook-action">
            <button className="btn-danger" onClick={() => navigate(`/books/${book.id}/delete`)} disabled={isPatching}>도서삭제</button>
            <button className="btn-ai-toggle" onClick={() => setIsAiMode(!isAiMode)} disabled={isPatching}>
              {isAiMode ? "표지 생성 취소" : "AI 표지 변경"}
            </button>
            <button className="btn-primary" onClick={() => navigate(`/books/${book.id}/edit`)} disabled={isPatching}>정보 수정</button>
          </div>

          {isAiMode && (
            <div className="viewbook-ai-request-wrapper">
              <div className="viewbook-textarea-group">
                <label className="viewbook-textarea-label">표지 수정을 위한 디자인 프롬프트 작성</label>
                <textarea
                  className="viewbook-feedback-textarea"
                  rows="4"
                  value={tempContent}
                  onChange={(e) => setTempContent(e.target.value)}
                  disabled={isPatching}
                  placeholder="원하는 프롬프트를 입력하면 새로운 표지를 그려냅니다. 미입력 시 책 제목과 내용을 기반으로 표지는 랜덤 생성됩니다."
                />
              </div>
              <BookCoverAIRequest book={modifiedBookForAi} onFieldChange={handleAiCoverGenerated} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
