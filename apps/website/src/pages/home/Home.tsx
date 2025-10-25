import { Hero } from "./hero/Hero";
import { About } from "./about/About";
import { Contact } from "./contact/Contact";
import { Creative } from "./creative/Creative";

export const Home = () => {
  return (
    <div>
      <div class="hero">
        <Hero />
      </div>

      <div class="contact">
        <Contact />
      </div>

      <div class="creative">
        <Creative />
      </div>
    </div>
  );
};
