import BookForm from "./BookForm";

// App.jsx 하위 부모 컴포넌트 - 책 신규 작성/등록 페이지
function AddBook({ onTransform, bookList, setBookList }) {
    const handleSubmit = async (bookData) => {
        // 첫 번째 async/await
        try {
            if (!bookData.title || !bookData.author) {
                alert("제목과 저자는 필수 입력 사항입니다.");
                return;
            }

            const response = await fetch("/books", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bookData),
            });

            if (response.ok) {
                alert("책이 성공적으로 등록되었습니다.");
            } else {
                alert("책 등록에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error adding book:", error);
            alert("책 등록 중 오류가 발생했습니다.");
        }
        // 두 번째 async/await
        try {
            const newBook = await response.json();
            setBookList([...bookList, newBook]);
            onTransform("view", newBook.id); // 책 목록 페이지로 이동
        } catch (error) {
            console.error("Error parsing response:", error);
            alert("책 목록 갱신에 실패했습니다.");
        }
    };

    return (
        <>
            <h1>책 신규 작성/등록</h1>
            <BookForm
                defaultTitle=""
                defaultAuthor=""
                onSubmit={handleSubmit}
            />
        </>
    );
}

export default AddBook;