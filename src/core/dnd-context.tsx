import type {
  Announcements,
  CollisionDetection,
  DndContextProps as DndContextPropsCore,
  KeyboardCoordinateGetter,
  PointerActivationConstraint,
  ScreenReaderInstructions,
  UniqueIdentifier,
} from "@dnd-kit/core";
import React from "react";
import {
  closestCenter,
  DndContext as DndContextCore,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import type { AnyObject } from "@acme/ui";

import type { SortableItemDef } from "../types";

type DndContextProps<TRecord extends AnyObject> = DndContextPropsCore & {
  items: { id: UniqueIdentifier }[];

  activationConstraint?: PointerActivationConstraint;
  coordinateGetter?: KeyboardCoordinateGetter;
  collisionDetection?: CollisionDetection;
  onChange?: (items: SortableItemDef<TRecord>[]) => void;
};

export const DndContext = <TRecord extends AnyObject>({
  items,

  activationConstraint,
  collisionDetection = closestCenter,
  coordinateGetter = sortableKeyboardCoordinates,

  ...props
}: DndContextProps<TRecord>) => {
  const getIndex = (id: UniqueIdentifier) =>
    items.findIndex((x) => x.id === id);
  const getPosition = (id: UniqueIdentifier) => getIndex(id) + 1;

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

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint,
    }),
    useSensor(TouchSensor, {
      activationConstraint,
    }),
    useSensor(KeyboardSensor, {
      // Disable smooth scrolling in Cypress automated tests
      scrollBehavior: "Cypress" in globalThis ? "auto" : undefined,
      coordinateGetter,
    }),
  );

  return (
    <DndContextCore
      accessibility={{
        announcements,
        screenReaderInstructions,
      }}
      collisionDetection={collisionDetection}
      sensors={sensors}
      {...props}
    />
  );
};

const screenReaderInstructions: ScreenReaderInstructions = {
  draggable: `
    To pick up a sortable item, press the space bar.
    While sorting, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.
  `,
};
