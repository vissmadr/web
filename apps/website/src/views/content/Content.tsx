import { Contact } from "./contact/Contact";
import { Creative } from "./creative/Creative";

export const Content = () => {
  return (
    <div>
      <div class="about">
        <p>Self-taught sorcerer, software engineer, and game developer.</p>
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
