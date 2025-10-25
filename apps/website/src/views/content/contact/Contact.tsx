import { For } from "solid-js";
import css from "./Contact.module.css";

import protonmailSVG from "./assets/protonmail.svg";
import githubSVG from "./assets/github.svg";
import twitterSVG from "./assets/twitter.svg";
import steamSVG from "./assets/steam.svg";
import discordSVG from "./assets/discord.svg";
import itchSVG from "./assets/itch.svg";
import redditSVG from "./assets/reddit.svg";

type Link = {
  name: string;
  title: string;
  icon: string;
  url: string;
};

const email: Link = {
  name: "protonmail",
  title: "vissmadr@pm.me",
  icon: protonmailSVG,
  url: "vissmadr@pm.me",
} as const;

const links: Link[] = [
  {
    name: "github",
    title: "github.com/vissmadr",
    icon: githubSVG,
    url: "https://github.com/vissmadr",
  } as const,
  {
    name: "x",
    title: "x.com/vissmadr",
    icon: twitterSVG,
    url: "https://x.com/vissmadr",
  } as const,
  {
    name: "steam",
    title: "Steam",
    icon: steamSVG,
    url: "https://steamcommunity.com/profiles/76561198780259928",
  } as const,
  {
    name: "reddit",
    title: "reddit.com/user/vissmadr",
    icon: redditSVG,
    url: "https://www.reddit.com/user/vissmadr",
  } as const,
  {
    name: "itch",
    title: "vissmadr.itch.io",
    icon: itchSVG,
    url: "https://vissmadr.itch.io/",
  } as const,
  {
    name: "discord",
    title: "discord.com/users/vissmadr",
    icon: discordSVG,
    url: "https://discord.com/users/vissmadr",
  } as const,
] as const;

export const Contact = () => {
  return (
    <section aria-label="Contact">
      <ul class={css.container}>
        <li class={css.box}>
          <a href={`mailto:${email.url}`}>
            <img
              src={email.icon}
              alt={email.name}
              title={email.title}
              aria-label={`Email ${email.title}`}
            />
          </a>
        </li>

        <For each={links}>
          {(link) => (
            <li class={css.box}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.title}
              >
                <img src={link.icon} alt={link.name} title={link.title} />
              </a>
            </li>
          )}
        </For>
      </ul>
    </section>
  );
};
