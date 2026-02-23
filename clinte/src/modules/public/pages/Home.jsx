import {
  Hero,
  Problems,
  Solutions,
  Dashboards,
  Pricing,
  CTA,
} from "../components";

const Home = () => {
  return (
    <div className="bg-black text-white">
      <Hero />
      <Problems />
      <Solutions />
      <Dashboards />
      <Pricing />
      <CTA />
    </div>
  );
};

export default Home;
