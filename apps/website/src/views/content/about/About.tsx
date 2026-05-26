import css from "./About.module.css";

export const About = () => {
  return (
    <section>
      <p class={css.description} aria-label="About">
        Self-taught creative developer, game designer, and knower of things.
      </p>
    </section>
  );
};
