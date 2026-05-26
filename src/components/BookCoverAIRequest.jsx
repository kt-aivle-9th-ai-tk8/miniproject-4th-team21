// 1. OpenAI 이미지 생성 요청
const res = await fetch(OPENAI_IMAGE_API_URL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userApiKey}`,
    },
    body: JSON.stringify({
        model: 'gpt-image-2',
        prompt,
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

// b64_json을 Data URL 형태로 변환합니다.
const imageSrc = `data:image/png;base64,${b64Json}`;

// 3. json-server에 coverImageUrl만 PATCH
// 바뀔 필드만 body에 담아 전송합니다.
await fetch(`http://localhost:3000/books/${id}`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        coverImageUrl: imageSrc,
    }),
});