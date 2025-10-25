import { type ParentProps } from "solid-js";

import { Hero } from "../views/hero/Hero";
import { Footer } from "../views/footer/Footer";

import css from "./Layout.module.css";

export const Layout = (props: ParentProps) => (
  <div class={css.layout}>
    <Hero />
    <main class={css.main}>{props.children}</main>
    <Footer />
  </div>
);
