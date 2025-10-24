import { For } from "solid-js";
import css from "./Contact.module.css";

import discordSVG from "./assets/discord.svg";
import githubSVG from "./assets/github.svg";
import itchSVG from "./assets/itch.svg";
import protonmailSVG from "./assets/protonmail.svg";
import redditSVG from "./assets/reddit.svg";
import steamSVG from "./assets/steam.svg";
import xSVG from "./assets/x.svg";

type Link = {
  name: string;
  icon: string;
  url: string;
};

const links: Link[] = [
  {
    name: "protonmail",
    icon: protonmailSVG,
    url: "vissmadr@pm.me",
  },
  {
    name: "github",
    icon: githubSVG,
    url: "https://github.com/vissmadr",
  },
  {
    name: "x",
    icon: xSVG,
    url: "https://x.com/vissmadr",
  },
  {
    name: "itch",
    icon: itchSVG,
    url: "https://vissmadr.itch.io/",
  },
] as const;

export const Contact = () => {
  return (
    <div>
      <h1>Contact</h1>

      <div class={css.container}>
        <For each={links}>
          {(link) => (
            <div class={css.box}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <img src={link.icon} alt={link.name} />
              </a>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
