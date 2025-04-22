import type { UniqueIdentifier } from "@dnd-kit/core";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@acme/ui";

import { useComposedRefs } from "../utils/composition";
import { useSortableStore } from "./use-sortable";

type SortableItemProps = Omit<React.ComponentProps<"li">, "id"> & {
  id: UniqueIdentifier;
  asChild?: boolean;
  asHandle?: boolean;

  disabled?: boolean;
};

export const SortableItem = ({
  id,
  ref,
  asChild,
  asHandle = true,

  disabled,
  style,
  className,

  ...props
}: SortableItemProps) => {
  const { flatCursor } = useSortableStore((s) => s);
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    disabled,
  });

  const composedRef = useComposedRefs(ref, (node) => {
    if (disabled) return;
    setNodeRef(node);
    if (asHandle) setActivatorNodeRef(node);
  });

  const composedStyle = React.useMemo<React.CSSProperties>(() => {
    return {
      transform: CSS.Translate.toString(transform),
      transition,
      ...style,
    };
  }, [transform, transition, style]);

  const ItemComp = asChild ? Slot : "li";

  return (
    <ItemComp
      id={id.toString()}
      ref={composedRef}
      style={composedStyle}
      className={cn(
        "focus-visible:ring-ring focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden",
        {
          "touch-none select-none": asHandle,
          "cursor-default": flatCursor,
          "data-dragging:cursor-grabbing": !flatCursor,
          "cursor-grab": !isDragging && asHandle && !flatCursor,
          "opacity-50": isDragging,
          "pointer-events-none opacity-50": disabled,
        },
        className,
      )}
      data-id={id}
      data-index={disabled ? undefined : 0}
      data-dragging={isDragging ? "" : undefined}
      {...(asHandle ? attributes : {})}
      {...(asHandle ? listeners : {})}
      {...props}
    />
  );
};
