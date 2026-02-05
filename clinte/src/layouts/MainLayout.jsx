import { Outlet } from "react-router-dom";
import Navbar from "../features/home/components/Navbar";
import Footer from "../features/home/components/Footer";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
