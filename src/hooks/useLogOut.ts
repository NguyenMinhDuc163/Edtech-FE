import { userService } from "@/services/User/userService";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export function useHandleLogout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await userService.logoutServer();
    } catch (err) {
      console.error(err);
    }

    navigate("/login", { replace: true });

    setTimeout(() => {
      logout();
    }, 0);
  };

  return handleLogout;
}
