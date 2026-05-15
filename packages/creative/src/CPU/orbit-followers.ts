import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/data-structures";
import { Random } from "@utilities/random";

const defaultConfig = {
  width: 600,
  height: 600,

  spawn: {
    initialCount: 10,
    maxCount: 160,
    chance: 0.045,
  },

  main: {
    radius: 14,
    color: "#ffffff",
  },

  follower: {
    radius: {
      min: 4,
      max: 8,
    },
    orbitRadius: {
      min: 45,
      max: 210,
    },
    colors: ["#f45d48", "#f7b32b", "#2d9cdb", "#5cdb95", "#7d5fff"],
  },

  physics: {
    radialStrength: 0.02,
    tangentStrength: 0.12,
    drag: 0.985,
    maxVelocity: 9,
  },

  colors: {
    background: "#111111",
  },
};

type Config = typeof defaultConfig;

type Follower = {
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  force: Vector2;
  radius: number;
  mass: number;
  orbitRadius: number;
  orbitDirection: number;
  color: string;
};

let config: Config;

const EPSILON = 0.0001;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d", { alpha: false, desynchronized: true });
  if (!context) throw "Cannot get 2d context";

  return context;
}

function setupInput(canvas: HTMLCanvasElement, position: Vector2) {
  const onPointerMove = (event: PointerEvent) => {
    const bounds = canvas.getBoundingClientRect();
    const xScale = config.width / bounds.width;
    const yScale = config.height / bounds.height;

    position.set((event.clientX - bounds.left) * xScale, (event.clientY - bounds.top) * yScale);
  };

  canvas.addEventListener("pointermove", onPointerMove);

  return () => {
    canvas.removeEventListener("pointermove", onPointerMove);
  };
}

function createFollower(target: Vector2): Follower {
  const radius = Random.range(config.follower.radius.min, config.follower.radius.max);
  const position = new Vector2(Random.range(0, config.width), Random.range(0, config.height));
  const toTarget = Vector2.subtract(target, position);
  const distance = Math.max(toTarget.magnitude(), EPSILON);
  const targetDirection = toTarget.scale(1 / distance);
  const orbitDirection = Random.bool() ? 1 : -1;
  const velocity = new Vector2(-targetDirection.y, targetDirection.x).scale(orbitDirection * Random.range(1.0, 3.0));

  return {
    position,
    velocity,
    acceleration: Vector2.Create.zero(),
    force: Vector2.Create.zero(),
    radius,
    mass: radius,
    orbitRadius: Random.range(config.follower.orbitRadius.min, config.follower.orbitRadius.max),
    orbitDirection,
    color: config.follower.colors[Random.rangeInt(0, config.follower.colors.length)],
  };
}

function limitVelocity(follower: Follower) {
  const maxVelocitySquared = config.physics.maxVelocity * config.physics.maxVelocity;

  if (follower.velocity.magnitudeSquared() <= maxVelocitySquared) return;

  follower.velocity.normalize().scale(config.physics.maxVelocity);
}

function applyOrbitForce(follower: Follower, target: Vector2) {
  const toTarget = Vector2.subtract(target, follower.position);
  const distance = Math.max(toTarget.magnitude(), EPSILON);
  const targetDirection = toTarget.scale(1 / distance);
  const distanceFromOrbit = distance - follower.orbitRadius;
  const radialForce = Vector2.clone(targetDirection).scale(distanceFromOrbit * config.physics.radialStrength);
  const tangentForce = new Vector2(-targetDirection.y, targetDirection.x).scale(
    follower.orbitDirection * config.physics.tangentStrength,
  );

  follower.force.add(radialForce).add(tangentForce);
}

function moveFollower(follower: Follower, target: Vector2) {
  follower.force.set(0, 0);
  applyOrbitForce(follower, target);

  // Integrate force -> acceleration -> velocity -> position.
  follower.acceleration.copy(follower.force).scale(1 / follower.mass);
  follower.velocity.add(follower.acceleration).scale(config.physics.drag);
  limitVelocity(follower);
  follower.position.add(follower.velocity);
}

function renderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = config.colors.background;
  context.fillRect(0, 0, config.width, config.height);
}

function renderFollower(context: CanvasRenderingContext2D, follower: Follower) {
  context.fillStyle = follower.color;
  Canvas2D.circleFill(context, follower.position.x, follower.position.y, follower.radius);
}

function renderMain(context: CanvasRenderingContext2D, position: Vector2) {
  context.fillStyle = config.main.color;
  Canvas2D.circleFill(context, position.x, position.y, config.main.radius);
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}): () => void {
  config = { ...defaultConfig, ...settings };

  const context = setupContext(canvas);
  const target = new Vector2(config.width * 0.5, config.height * 0.5);
  const cleanupInput = setupInput(canvas, target);
  const followers: Follower[] = [];

  for (let i = 0; i < config.spawn.initialCount; i++) {
    followers.push(createFollower(target));
  }

  let animationId: number;
  const animation = () => {
    if (followers.length < config.spawn.maxCount && Random.chance(config.spawn.chance)) {
      followers.push(createFollower(target));
    }

    renderBackground(context);

    for (const follower of followers) {
      moveFollower(follower, target);
      renderFollower(context, follower);
    }

    renderMain(context, target);

    animationId = requestAnimationFrame(animation);
  };

  animationId = requestAnimationFrame(animation);

  return () => {
    cancelAnimationFrame(animationId);
    cleanupInput();
  };
}
