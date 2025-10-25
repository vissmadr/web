import css from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer class={css.footer}>
      <a
        class={css.link}
        href={"https://github.com/vissmadr"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <code class={css.code}>handcrafted</code>
        <code class={css.code}>v1.0</code>
      </a>
    </footer>
  );
};
