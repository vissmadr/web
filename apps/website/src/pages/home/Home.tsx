import { Creative } from "./creative/Creative";
import { Data } from "../../data";
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
        <h1>Contact</h1>
        <div>
          <a href={Data.contact.email}>Email</a>
        </div>
        <div>
          <a href={Data.contact.github}>GitHub</a>
        </div>
        <div>
          <a href={Data.contact.twitter}>X</a>
        </div>
      </div>

      <div class="creative">
        <Creative />
      </div>
    </div>
  );
};
