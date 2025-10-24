/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { For } from "solid-js";

import { Home } from "./pages/home/Home";
import { NotFound } from "./pages/not-found/NotFound";
import { CreativePage } from "./pages/arts/CreativePage";
import { creatives } from "./pages/arts/creative-data";

import "./styles/reset.css";
import "./styles/style.css";

const root = document.getElementById("root");
if (!root) throw "Invalid #root HTML element!";

const App = () => (
  <Router>
    <Route path="/" component={Home} />
    <For each={creatives}>
      {(art) => (
        <Route path={art.route} component={() => <CreativePage creative={art} />} />
      )}
    </For>
    <Route path="*404" component={NotFound} />
  </Router>
);

render(App, root);
