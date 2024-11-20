import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Home = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) return <Navigate to={"/apartments"} />;
  else return <Navigate to={"/auth/login"} />;
};

export default Home;
