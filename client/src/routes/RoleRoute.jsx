import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext"


const RoleRoute = ({ children, allowedRole }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" />
    }

    if (user.role !== allowedRole) {
        return <Navigate to="/dashboard" />
    }

    return children;
}

export default RoleRoute;