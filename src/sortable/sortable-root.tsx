/* eslint-disable @typescript-eslint/unbound-method */
import type {
  Announcements,
  CollisionDetection,
  DndContextProps,
  DragEndEvent,
  KeyboardCoordinateGetter,
  PointerActivationConstraint,
  ScreenReaderInstructions,
  UniqueIdentifier,
} from "@dnd-kit/core";
import type { SortingStrategy } from "@dnd-kit/sortable";
import React from "react";
import {
  closestCenter,
  closestCorners,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { AnyObject } from "@acme/ui";

import type { SortableItemDef } from "../types";
import { composeEventHandlers } from "../utils/composition";
import { SortableStoreProvider } from "./use-sortable";

const orientationConfig = {
  vertical: {
    modifiers: [restrictToVerticalAxis, restrictToParentElement],
    strategy: verticalListSortingStrategy,
    collisionDetection: closestCenter,
  },
  horizontal: {
    modifiers: [restrictToHorizontalAxis, restrictToParentElement],
    strategy: horizontalListSortingStrategy,
    collisionDetection: closestCenter,
  },
  mixed: {
    modifiers: [restrictToParentElement],
    strategy: undefined,
    collisionDetection: closestCorners,
  },
};

const screenReaderInstructions: ScreenReaderInstructions = {
  draggable: `
      To pick up a sortable item, press the space bar.
      While sorting, use the arrow keys to move the item.
      Press space again to drop the item in its new position, or press escape to cancel.
    `,
};

type SortableRootProps<TRecord extends AnyObject> = DndContextProps & {
  items: SortableItemDef<TRecord>[];

  orientation?: "vertical" | "horizontal" | "mixed";

  activationConstraint?: PointerActivationConstraint;
  coordinateGetter?: KeyboardCoordinateGetter;
  collisionDetection?: CollisionDetection;

  strategy?: SortingStrategy;

  // onMove?: typeof arrayMove;
  // onDragEnd?: (
  //   args: { activeIndex: number; overIndex: number },
  //   flattenedItems: SortableItemDef<TRecord>[],
  // ) => void;
  onChange?: (items: SortableItemDef<TRecord>[]) => void;
};
const SortableRoot = <TRecord extends AnyObject>({
  items,
  orientation = "vertical",
  accessibility,

  modifiers: modifiersProp,
  strategy: strategyProp,

  activationConstraint,
  collisionDetection,
  coordinateGetter = sortableKeyboardCoordinates,

  // onMove = arrayMove,
  onDragStart: onDragStartProp,
  onDragEnd: onDragEndProp,
  onDragCancel: onDragCancelProp,
  onChange,
  ...props
}: SortableRootProps<TRecord>) => {
  // =================== Utils ====================
  const getIndex = React.useCallback(
    (id: UniqueIdentifier) => items.findIndex((x) => x.id === id),
    [items],
  );
  const getPosition = (id: UniqueIdentifier) => getIndex(id) + 1;

  // =================== Config===================
  const config = React.useMemo(
    () => orientationConfig[orientation],
    [orientation],
  );

  const modifiers = modifiersProp ?? config.modifiers;

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // activationConstraint,
    }),
    useSensor(TouchSensor, {
      // activationConstraint,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    }),
  );

  const isFirstAnnouncement = React.useRef(true);

  const announcements: Announcements = {
    onDragStart({ active: { id } }) {
      return `Picked up sortable item ${String(
        id,
      )}. Sortable item ${id} is in position ${getPosition(id)} of ${
        items.length
      }`;
    },
    onDragOver({ active, over }) {
      // In this specific use-case, the picked up item's `id` is always the same as the first `over` id.
      // The first `onDragOver` event therefore doesn't need to be announced, because it is called
      // immediately after the `onDragStart` announcement and is redundant.
      if (isFirstAnnouncement.current === true) {
        isFirstAnnouncement.current = false;
        return;
      }

      if (over) {
        return `Sortable item ${
          active.id
        } was moved into position ${getPosition(over.id)} of ${items.length}`;
      }

      return;
    },
    onDragEnd({ active, over }) {
      if (over) {
        return `Sortable item ${
          active.id
        } was dropped at position ${getPosition(over.id)} of ${items.length}`;
      }

      return;
    },
    onDragCancel({ active: { id } }) {
      return `Sorting was cancelled. Sortable item ${id} was dropped and returned to position ${getPosition(
        id,
      )} of ${items.length}.`;
    },
  };

  // =================== Events Handler====================

  const [activeItem, setActiveItem] =
    React.useState<SortableItemDef<TRecord> | null>(null);
  const activeIndex = activeItem?.id ? getIndex(activeItem.id) : -1;

  const onDragStart = composeEventHandlers(onDragStartProp, ({ active }) =>
    setActiveItem(items.find((x) => x.id === active.id) ?? null),
  );
  const onDragEnd = composeEventHandlers(
    onDragEndProp,
    (event: DragEndEvent) => {
      const { over } = event;
      setActiveItem(null);

      if (over) {
        const overIndex = getIndex(over.id);
        if (activeIndex !== overIndex) {
          const reorderedItems = arrayMove(items, activeIndex, overIndex);
          onChange?.(reorderedItems);
        }
      }
    },
  );

  const onDragCancel = composeEventHandlers(onDragCancelProp, () =>
    setActiveItem(null),
  );

  return (
    <SortableStoreProvider items={items} strategy={strategyProp}>
      <DndContext
        accessibility={{
          announcements,
          screenReaderInstructions,
          ...accessibility,
        }}
        collisionDetection={collisionDetection ?? config.collisionDetection}
        modifiers={modifiers}
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
        {...props}
      />
    </SortableStoreProvider>
  );
};

export { SortableRoot };
