/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { For, type ParentProps } from "solid-js";

import { Content } from "./views/content/Content";
import { NotFound } from "./views/content/not-found/NotFound";
import { CreativePage } from "./views/content/creative/CreativePage";
import { creatives } from "./views/content/creative/creative-data";

import "./styles/reset.css";
import "./styles/style.css";
import { Hero } from "./views/hero/Hero";
import { Footer } from "./views/footer/Footer";

const root = document.getElementById("root");
if (!root) throw "Invalid #root HTML element!";

const Layout = (props: ParentProps) => (
  <div>
    <Hero />
    <main>{props.children}</main>
    <Footer />
  </div>
);

const App = () => (
  <Router root={Layout}>
    <Route path="/" component={Content} />
    <For each={creatives}>
      {(creative) => (
        <Route
          path={creative.route}
          component={() => <CreativePage creative={creative} />}
        />
      )}
    </For>
    <Route path="*404" component={NotFound} />
  </Router>
);

render(App, root);
