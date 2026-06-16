// 로딩 스피너 / 백엔드 사용불가 다이얼로그를 그리는 화면 전용 컴포넌트.
// 상태는 useServerRequest 훅이 각 페이지별로 로컬에서 관리하고, 이 컴포넌트는 표시만 담당한다.
function ServerStatusOverlay({ status, onRetry }) {
    if (status === 'loading') {
        return (
            <div className="server-status-overlay server-status-loading">
                <div className="server-status-spinner" />
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="server-status-overlay server-status-error">
                <div className="server-status-dialog">
                    <h2>백엔드 서비스를 사용할 수 없습니다.</h2>
                    <p>현재 백엔드 서비스가 사용 불가능합니다.<br />잠시 후 다시 시도해주세요.</p>
                    <button onClick={onRetry}>다시 시도</button>
                </div>
            </div>
        );
    }

    return null;
}

export default ServerStatusOverlay;
