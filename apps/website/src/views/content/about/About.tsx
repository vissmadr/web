import css from "./About.module.css";

export const About = () => {
  return (
    <section>
      <p class={css.description} aria-label="About">
        Self-taught software engineer, game developer, and knower of things.
      </p>
    </section>
  );
};
