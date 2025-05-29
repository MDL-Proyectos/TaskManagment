import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";

const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
    }

export const isLoading = () => {
    const context = useContext(AuthContext);
    if (context?.user) {
        return true;
    }
    return false;
}
export default useAuth;