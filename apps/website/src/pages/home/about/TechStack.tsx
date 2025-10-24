import css from "./TechStack.module.css";

export const TechStack = () => {
  return (
    <div class={css.techstack}>
      <div class={css.row}>
        <img src="https://skillicons.dev/icons?i=html" alt="html" />
        <img src="https://skillicons.dev/icons?i=css" alt="css" />
        <img src="https://skillicons.dev/icons?i=js" alt="javascript" />
        <img src="https://skillicons.dev/icons?i=ts" alt="typescript" />
        <img src="https://skillicons.dev/icons?i=nodejs" alt="nodejs" />
        <img src="https://skillicons.dev/icons?i=solidjs" alt="solidjs" />
      </div>
      <div class={css.row}>
        <img src="https://skillicons.dev/icons?i=c" alt="c" />
        <img src="https://skillicons.dev/icons?i=cpp" alt="c++" />
        <img src="https://skillicons.dev/icons?i=zig" alt="zig" />
        <img src="https://cdn.simpleicons.org/opengl/5586A4" alt="opengl" />
        <img src="https://skillicons.dev/icons?i=godot" alt="godot" />
        <img src="https://skillicons.dev/icons?i=unity" alt="unity" />
      </div>
      <div class={css.row}>
        <img src="https://skillicons.dev/icons?i=sqlite" alt="sqlite" />
        <img src="https://skillicons.dev/icons?i=git" alt="git" />
        <img src="https://skillicons.dev/icons?i=github" alt="github" />
        <img src="https://skillicons.dev/icons?i=bash" alt="bash" />
        <img src="https://skillicons.dev/icons?i=linux" alt="linux" />
        <img src="https://skillicons.dev/icons?i=neovim" alt="neovim" />
      </div>
    </div>
  );
};
