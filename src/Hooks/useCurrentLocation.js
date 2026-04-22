import { useLocation } from "react-router-dom";

export default function useCurrentLocation() {
    const location = useLocation();
    return location.pathname

}
