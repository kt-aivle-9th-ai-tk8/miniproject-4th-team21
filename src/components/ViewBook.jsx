import { useEffect } from 'react';

export default function ViewBook({ book, onTransform }) {

  useEffect(() => {
    if (!book) {
      onTransform('unavailable');
    }
  }, [book, onTransform]);

  const handleDelete = async () => {
    if (!window.confirm('정말 이 도서를 삭제하시겠습니까?')) return; 
    
    try {
      await fetch(`http://localhost:3000/books/${book.id}`, { method: 'DELETE' });
      alert('삭제되었습니다.');
      onTransform('list'); 
    } catch (err) {
      console.error(err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  if (!book) return null;

  return (
    <main className="flex-grow pt-lg pb-xl px-margin max-w-7xl mx-auto w-full">
      <div 
        onClick={() => onTransform('list')}
        className="mb-sm flex items-center gap-xs text-on-surface-variant font-body2 text-body2 hover:text-primary transition-colors cursor-pointer w-fit"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        목록으로 돌아가기
      </div>
      
      <h1 className="font-h4 text-h4 text-on-surface mb-xl">도서 상세 정보</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
        <div className="md:col-span-4 lg:col-span-3 flex justify-center md:justify-start">
          <div className="relative group w-full max-w-[280px] bg-surface-container-lowest p-2 rounded-xl shadow-sm border border-outline-variant/30">
            {book.coverImageUrl ? (
              <img alt="Book Cover" className="w-full object-cover rounded-lg shadow-sm aspect-[2/3]" src={book.coverImageUrl} />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">이미지 없음</div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-md bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30 min-h-[420px]">
          <div className="flex flex-col gap-md">
            <h2 className="font-h3 text-h3 text-on-surface leading-tight">{book.title}</h2>
            <div className="flex items-center gap-md">
              <span className="font-subtitle1 text-subtitle1 text-on-surface-variant">{book.author} 저</span>
            </div>
            
            <div className="mt-md flex gap-md">
              <div className="flex flex-col gap-xs">
                <p className="text-caption font-medium text-on-surface-variant/80 uppercase tracking-wider">등록일</p>
                <div className="flex items-center gap-xs text-primary font-h6 text-h6">
                  <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                  <span className="font-medium">{book.createdAt ? new Date(book.createdAt).toLocaleDateString() : '날짜 없음'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-lg">
            <h3 className="font-h6 text-h6 text-on-surface mb-sm">도서 소개</h3>
            <p className="font-body1 text-body1 text-on-surface-variant leading-relaxed">
              {book.content}
            </p>
          </div>
          
          <div className="mt-auto pt-lg flex items-center gap-md">
            <button onClick={handleDelete} className="bg-[#e53935] text-white hover:bg-error/90 font-button text-button px-8 py-2.5 rounded shadow-sm transition-colors">
              도서삭제
            </button>
            <button onClick={() => onTransform('edit', book.id)} className="bg-surface-container text-on-surface hover:bg-surface-container-highest border border-outline-variant font-button text-button px-8 py-2.5 rounded transition-colors">
              정보 수정
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}