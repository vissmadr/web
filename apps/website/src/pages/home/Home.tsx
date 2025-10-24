import { Creative } from "../../creative/Creative";
import { Data } from "../../data";

export const Home = () => {
  return (
    <div class="page">
      <h1>Vissmadr</h1>
      <p>Home page text.</p>

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
