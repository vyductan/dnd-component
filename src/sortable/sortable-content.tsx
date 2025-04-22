"use client";

import { SortableContext } from "@dnd-kit/sortable";
import { Slot } from "@radix-ui/react-slot";

import { useSortableStore } from "./use-sortable";

type SortableContentProps = React.ComponentProps<"ul"> & {
  asChild?: boolean;
};

export const SortableContent = ({
  asChild,
  ...props
}: SortableContentProps) => {
  const { items, strategy } = useSortableStore((s) => s);

  const ListComp = asChild ? Slot : "ul";

  return (
    <SortableContext items={items} strategy={strategy}>
      <ListComp {...props} />
    </SortableContext>
  );
};
