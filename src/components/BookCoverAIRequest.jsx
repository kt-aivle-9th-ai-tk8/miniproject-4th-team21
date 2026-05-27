import { useState } from "react";

function BookCoverAIRequest({ book, onFieldChange }) {
    const OPENAI_IMAGE_API_URL = "https://api.openai.com/v1/images/generations";
    
    // UI 입력값 상태 관리
    const [userApiKey, setUserApiKey] = useState("");
    const [selectedModel, setSelectedModel] = useState("gpt-image-2");
    const [selectedQuality, setSelectedQuality] = useState("medium");
    const [loading, setLoading] = useState(false);

    const createBookCoverPrompt = (title, content) => {
        // 책 내용 및 설명 150자 제한
        // "an inspiring book layout" -> 내용이 없을 경우에도 대략적인 표지 생성 위한 임시 값
        const summarizedContent = content ? content.slice(0, 150) : "an inspiring book layout";

        return `A professional front book cover design artwork.
        The book title is "${title}".
        The illustration should represent the following story and mood: ${summarizedContent}.
        
        [Style instructions]: Modern minimalist graphic design, award-winning book illustration, artistic, high resolution, clean layout.
        [Crucial]: DO NOT write any text or letters on the cover except the title.`;
    }

    async function handleGenerateCover() {
        if (!userApiKey) {
            alert("API Key를 입력해주세요.");
            return;
        }

        const isConfirmed = window.confirm(
            "AI 표지 생성 비용 안내\n\n이미지를 생성할 때마다 API Key의 비용이 실제로 차감됩니다.\n정말 생성을 진행하시겠습니까?"
        );

        if (!isConfirmed) return;

        setLoading(true);
        try {
            // 1. OpenAI 이미지 생성 요청
            const res = await fetch(OPENAI_IMAGE_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userApiKey}`,
                },
                body: JSON.stringify({
                    model: selectedModel,
                    prompt: createBookCoverPrompt(book.title, book.content),
                    n: 1,
                    size: '1024x1536',
                    quality: selectedQuality,
                    output_format: 'png',
                }),
            });

            if (!res.ok) throw new Error('OpenAI 요청 실패');

            // 2. OpenAI 응답 파싱 후 b64_json 추출
            const data = await res.json();
            const b64Json = data.data?.[0]?.b64_json;

            // b64_json을 Data URL 형태로 변환
            const imageSrc = `data:image/png;base64,${b64Json}`;

            // 3. json-server에 coverImageUrl만 PATCH
            // 바뀔 필드만 body에 담아 전송
            /* 
            const patchRes = await fetch(`http://localhost:3000/books/${book.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    coverImageUrl: imageSrc,
                }),
            });

            if (!patchRes.ok) throw new Error('서버 저장 실패');
            
            const updatedBook = await patchRes.json(); */

            // 4. 상태 업데이트 -> 화면 반영
            onFieldChange({
                ...book,
                coverImageUrl: imageSrc
            });
            alert("표지 생성 완료");

        } catch (error) {
            console.error(error);
            alert("에러 발생");
        } finally {
            setLoading(false);
        }
    }

return (
        <section className="ai-cover-card">
            {/* 제목 및 설명 */}
            <div className="ai-cover-header">
                <h3>✨ AI 대체 표지 생성</h3>
                <p className="ai-cover-description">
                    기존 표지 이미지가 손상되었거나 저작권 문제가 있는 경우, 도서의 메타데이터(제목, 저자, 장르)를 기반으로 
                    인공지능을 활용하여 새로운 대체 표지를 생성할 수 있습니다. 생성 기능을 사용하려면 유효한 API 키가 필요합니다.
                </p>
            </div>

            <div className="container">
                <div className="input-side">
                    {/* API Key 입력 섹션 */}
                    <div>
                        <label>OpenAI API Key *</label>
                        <input 
                            type="password" 
                            placeholder="sk-..."
                            value={userApiKey}
                            onChange={(e) => setUserApiKey(e.target.value)}
                        />
                        <span>입력된 키는 서버에 저장되지 않으며 1회 생성에만 사용됩니다.</span>
                    </div>

                    {/* 모델 및 품질 선택 섹션 */}
                    <div className="options">
                        <div>
                            <label>생성 모델</label>
                            <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                                <option value="gpt-image-2">GPT Image 2</option>
                            </select>
                        </div>
                        <div>
                            <label>품질</label>
                            <select value={selectedQuality} onChange={(e) => setSelectedQuality(e.target.value)}>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    {/* 생성 버튼 */}
                    <button 
                        type="button"
                        onClick={handleGenerateCover} 
                        disabled={loading}
                    >
                        {loading ? "생성 중..." : "✨ AI 표지 생성"}
                    </button>
                </div>

                {/* 미리보기 영역 */}
                <div className="preview-side">
                    {book.coverImageUrl ? (<img src={book.coverImageUrl} alt="생성된 표지" />) : (
                        <div>
                            <p>🖼️</p>
                            <p>생성된 표지가 여기에 표시됩니다</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default BookCoverAIRequest;