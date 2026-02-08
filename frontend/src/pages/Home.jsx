import AboutSection from "../components/AboutSection";
import Categories from "../components/Categories";
import Hero from "../components/Hero";
import Menus from "../components/Menus";
import Testimonial from "../components/Testimonial";

const Home = () => {
  return (
    <div className="relative z-10 isolate ">
      <Hero />
      <main className="relative z-20">
        <Categories />
        <Menus />
        <AboutSection />
        <Testimonial />
      </main>
    </div>
  );
};
export default Home;
