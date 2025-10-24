import { Contact } from "./contact/Contact";
import { Creative } from "./creative/Creative";
import { TechStack } from "./TechStack";

export const Home = () => {
  return (
    <div class="page">
      <div class="intro">
        <h1>vissmadr</h1>
        <p>Home page text.</p>
      </div>

      <div class="about">
        <h1>About</h1>
        <p>Creative software developer</p>
        <TechStack />
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
