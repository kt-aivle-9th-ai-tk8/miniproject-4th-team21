export const API_URL = 'http://localhost:8080/books';

export const runBookRequest = async (request, { errorMessage } = {}) => {
  try {
    const response = await request();

    if (response.ok) {
      const text = await response.text();
      if (!text) return { success: true, status: response.status, data: null };
      try {
        return { success: true, status: response.status, data: JSON.parse(text) };
      } catch (error) {
        console.error('JSON 파싱 실패:', error);
        return { success: false, status: response.status, errorType: 'PARSE_ERROR', error, data: null };
      }
    }

    let errorBody = null;
    try { errorBody = await response.json(); } catch { try { errorBody = await response.text(); } catch {} }
    return { success: false, status: response.status, errorType: response.status >= 500 ? 'SERVER_ERROR' : 'CLIENT_ERROR', error: errorBody };
  } catch (error) {
    if (errorMessage) console.error(errorMessage, error);
    return { success: false, status: null, errorType: 'NETWORK_ERROR', error };
  }
};

export const fetchBooks = (filterData = null) => {
  let url = API_URL;
  if (filterData) {
    const { category, searchType, keyword } = filterData;
    url = `${API_URL}?category=${encodeURIComponent(category)}&searchType=${encodeURIComponent(searchType)}&keyword=${encodeURIComponent(keyword)}`;
  }
  return runBookRequest(() => fetch(url), { errorMessage: '도서 목록을 불러오는 중 오류 발생:' });
};

export const fetchBookById = (bookId) =>
  runBookRequest(() => fetch(`${API_URL}/${bookId}`), { errorMessage: '도서 단건 조회 실패:' });

export const createBook = (bookData) => {
  const now = new Date().toISOString();
  return runBookRequest(
    () => fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...bookData, createdAt: now, updatedAt: now }),
    }),
    { errorMessage: '도서 등록 실패:' }
  );
};

export const updateBook = (bookId, bookData) =>
  runBookRequest(
    () => fetch(`${API_URL}/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...bookData, updatedAt: new Date().toISOString() }),
    }),
    { errorMessage: '도서 수정 실패:' }
  );

export const deleteBook = (bookId) =>
  runBookRequest(
    () => fetch(`${API_URL}/${bookId}`, { method: 'DELETE' }),
    { errorMessage: '도서 삭제 실패:' }
  );

export const updateBookCover = (bookId, coverImageUrl) =>
  runBookRequest(
    () => fetch(`${API_URL}/${bookId}/cover`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coverImageUrl }),
    }),
    { errorMessage: 'PATCH 요청 중 오류 발생:' }
  );
