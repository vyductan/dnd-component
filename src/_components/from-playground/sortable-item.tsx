import type { UniqueIdentifier } from "@dnd-kit/core";
import type { AnimateLayoutChanges, NewIndexGetter } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";

import type { CustomizeComponent } from "@acme/ui/components/table";

import type { DndSortableProps } from "../sortable";
import type { ItemProps } from "./item";
import { Item } from "./item";

interface SortableItemProps
  extends Omit<ItemProps, "style" | "wrapperStyle" | "onRemove"> {
  id: UniqueIdentifier;
  index: number;
  children: React.ReactNode;

  animateLayoutChanges?: AnimateLayoutChanges;
  disabled?: boolean;
  getNewIndex?: NewIndexGetter;
  handle: boolean;
  useDragOverlay?: boolean;
  onRemove?(id: UniqueIdentifier): void;
  style(values: any): React.CSSProperties;
  renderItem?(args: any): React.ReactElement<any>;
  wrapperStyle: DndSortableProps["wrapperStyle"];

  components?: ItemProps["components"];
}

export const SortableItem = ({
  disabled,
  animateLayoutChanges,
  getNewIndex,
  handle,
  id,
  index,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  onRemove,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  style,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  renderItem,
  useDragOverlay,
  wrapperStyle,

  children,

  components,

  ...itemProps
}: SortableItemProps) => {
  const {
    active,
    attributes,
    isDragging,
    isSorting,
    listeners,
    overIndex,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
    disabled,
    getNewIndex,
  });

  // const I = components?.item ?? Item;
  // console.log("cc", components?.item);
  return (
    <Item
      ref={setNodeRef}
      // value={id}
      disabled={disabled}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      handleProps={
        handle
          ? {
              ref: setActivatorNodeRef,
            }
          : undefined
      }
      renderItem={renderItem}
      index={index}
      style={style({
        id,
        index,
        isDragging,
        isSorting,
        overIndex,
      })}
      onRemove={onRemove ? () => onRemove(id) : undefined}
      transform={transform}
      transition={transition}
      wrapperStyle={wrapperStyle?.({ index, isDragging, active, id })}
      listeners={listeners}
      data-index={index}
      data-id={id}
      dragOverlay={!useDragOverlay && isDragging}
      {...attributes}
      // own
      id={id}
      components={components}
      {...itemProps}
    >
      {children}
    </Item>
  );
};
