function ProblemOccured() {
    return (
        <div className="problemoccured">
            <h2>문제가 발생했습니다.</h2>
            <p>죄송합니다. 요청하신 작업을 처리하는 중에 문제가 발생했습니다.</p>
            <button onClick={() => window.location.reload()}>목록으로 돌아가기</button>
        </div>
    );
}

export default ProblemOccured;