import LogIn from "./partials/LogIn";
import MainContents from "./MainContents";
import SignPage from "./partials/SignPage";
import { useContext } from "react";
import { UserContext } from "./store/UserContext";

const Main = () => {
  const context = useContext(UserContext);
  const { isLoggedIn } = context.userState;

  if (isLoggedIn) {
    return <MainContents />;
  } else {
    return <SignPage />;
  }
};

export default Main;
