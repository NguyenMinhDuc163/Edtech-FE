import { useNavigate } from "react-router-dom";

export default function useGoBack() {
  const navigate = useNavigate();
  return () => navigate(-1);
}
