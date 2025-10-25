import { For } from "solid-js";
import css from "./Contact.module.css";

import discordSVG from "./assets/discord.svg";
import githubSVG from "./assets/github.svg";
import itchSVG from "./assets/itch.svg";
import redditSVG from "./assets/reddit.svg";
import steamSVG from "./assets/steam.svg";
import protonmailSVG from "./assets/protonmail.svg"
import twitterSVG from "./assets/twitter.svg"

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
    icon: twitterSVG,
    url: "https://x.com/vissmadr",
  },
  {
    name: "itch",
    icon: itchSVG,
    url: "https://vissmadr.itch.io/",
  },
    // TODO
  {
    name: "steam",
    icon: steamSVG,
    url: "",
  },
  {
    name: "discord",
    icon: discordSVG,
    url: "",
  },
  {
    name: "reddit",
    icon: redditSVG,
    url: "",
  },
] as const;

export const Contact = () => {
  return (
    <div>
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
