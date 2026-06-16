import { useState, useCallback } from 'react';
import ServerStatusOverlay from '../components/ServerStatusOverlay';

// 페이지별로 로딩/에러 상태를 "로컬"로 관리하는 훅.
// 기존 전역 단일 state(ServerStatusContext)는 라우트 전환 중 진행 중인 요청끼리
// 서로의 상태를 덮어쓰는 문제가 있어, 각 페이지가 자기 요청의 상태만 들도록 분리했다.
//
// 사용법:
//   const { startLoading, handleServerError, clearStatus, overlay } = useServerRequest();
//   ...요청 분기 처리...
//   return (<>{overlay}<div>...</div></>);
export function useServerRequest() {
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'error'
    const [retryFn, setRetryFn] = useState(null);

    const startLoading = useCallback(() => setStatus('loading'), []);

    const handleServerError = useCallback((retry) => {
        setRetryFn(retry ? () => retry : null);
        setStatus('error');
    }, []);

    const clearStatus = useCallback(() => {
        setStatus('idle');
        setRetryFn(null);
    }, []);

    const handleRetry = useCallback(() => {
        clearStatus();
        retryFn?.();
    }, [clearStatus, retryFn]);

    const overlay = <ServerStatusOverlay status={status} onRetry={handleRetry} />;

    return { startLoading, handleServerError, clearStatus, overlay };
}
