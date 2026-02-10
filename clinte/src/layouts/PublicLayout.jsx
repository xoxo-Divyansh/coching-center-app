import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  console.log("PublicLayout rendered")
  return (
    <>
      <Outlet />
    </>
  );
};

export default PublicLayout;
