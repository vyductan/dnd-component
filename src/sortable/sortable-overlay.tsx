import type { DropAnimation } from "@dnd-kit/core";
import React from "react";
import { defaultDropAnimationSideEffects, DragOverlay } from "@dnd-kit/core";
import ReactDOM from "react-dom";

import { cn } from "@acme/ui/lib/utils";

import type { SortableItemDef } from "../types";
import { useSortableStore } from "./use-sortable";

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};
interface SortableOverlayProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DragOverlay>, "children"> {
  container?: Element | DocumentFragment | null;
  children?:
    | ((params: { item: SortableItemDef }) => React.ReactNode)
    | React.ReactNode;
}

function SortableOverlay({
  container: containerProp,
  children,
  ...overlayProps
}: SortableOverlayProps) {
  const { flatCursor, modifiers, activeItem } = useSortableStore((s) => s);

  const [mounted, setMounted] = React.useState(false);
  React.useLayoutEffect(() => setMounted(true), []);

  const container =
    containerProp ?? (mounted ? globalThis.document.body : null);

  if (!container) return null;

  return ReactDOM.createPortal(
    <DragOverlay
      dropAnimation={dropAnimation}
      modifiers={modifiers}
      className={cn(!flatCursor && "cursor-grabbing")}
      {...overlayProps}
    >
      {activeItem
        ? typeof children === "function"
          ? children({ item: activeItem })
          : children
        : null}
    </DragOverlay>,
    container,
  );
}

export { SortableOverlay };
