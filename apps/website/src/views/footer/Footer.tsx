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
        <span class={css.info}>handcrafted</span>
        <span class={css.info}>v1.1</span>
      </a>
    </footer>
  );
};
