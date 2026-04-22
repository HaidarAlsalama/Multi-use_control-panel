import { useLocation } from 'react-router-dom';

export default function useParam(key) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const result = queryParams.get(key); //
    return result ? result : null;
}
