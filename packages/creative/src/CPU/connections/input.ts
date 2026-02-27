import { Collision } from "@utilities/collision";
import { Rectangle } from "@utilities/shapes";
import { Config } from "./config";
import { Node } from "./node";
import { Quadtree, Vector2 } from "@utilities/data-structures";

export class Input {
  position = Vector2.Create.infinity();
  isClicked: boolean = false;

  targetedNodeID: number | null = null;

  private cleanupListeners: () => void;

  constructor(target: HTMLElement) {
    const onPointerDown = () => {
      this.isClicked = true;
    };

    const onPointerUp = () => {
      this.isClicked = false;
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = target.getBoundingClientRect();
      this.position.x = event.clientX - bounds.left;
      this.position.y = event.clientY - bounds.top;
    };

    const onBlur = () => {
      this.isClicked = false;
    };

    target.addEventListener("pointerdown", onPointerDown);
    target.addEventListener("pointerup", onPointerUp);
    target.addEventListener("pointermove", onPointerMove);
    window.addEventListener("blur", onBlur);

    this.cleanupListeners = () => {
      target.removeEventListener("pointerdown", onPointerDown);
      target.removeEventListener("pointerup", onPointerUp);
      target.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", onBlur);
    };
  }

  destroy() {
    this.cleanupListeners();
  }

  main(quadtree: Quadtree<Node, any>, nodes: Node[]) {
    const inCanvas = Collision.point_rectangle(this.position.x, this.position.y, 0, 0, Config.width, Config.height);
    if (!inCanvas) return;

    if (this.isClicked) {
      this.targetedNodeID !== null && nodes[this.targetedNodeID].position.copy(this.position);

      return;
    }

    this.targetedNodeID = null;

    const targetArea: Rectangle = {
      x: this.position.x - Config.render.node.radius,
      y: this.position.y - Config.render.node.radius,
      w: Config.render.node.radius * 2,
      h: Config.render.node.radius * 2,
    };

    const nodesInArea = quadtree.query(targetArea);
    for (const target of nodesInArea) {
      if (Collision.point_circle(this.position.x, this.position.y, target.x, target.y, Config.render.node.radius)) {
        this.targetedNodeID = target.id;

        this.isClicked && target.position.copy(this.position);
      }
    }
  }
}
