import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/shared/header/Header";
import SideBar from "./components/shared/sidebar/SideBar";

function App() {
  return (
    <div className="App">
      <Header />
      <SideBar />
      <div className="pt-[100px] xxsm:ml-0 ml-[80px] pb-[50px]">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
