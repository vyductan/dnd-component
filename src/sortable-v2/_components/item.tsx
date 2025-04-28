import type {
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import React, { useEffect } from "react";

import type { AnyObject } from "@acme/ui";
import type { CustomizeComponent } from "@acme/ui/components/table";
import { cn } from "@acme/ui/lib/utils";

import { Handle } from "../../sortable-v1/_components/handle";
import styles from "./item.module.css";
import { Remove } from "./remove";

export interface ItemProps<TRecord extends AnyObject = AnyObject> {
  id: UniqueIdentifier;
  index: number;
  record: TRecord;
  children: React.ReactNode;

  dragOverlay?: boolean;
  color?: string;
  disabled?: boolean;
  dragging?: boolean;
  handle?: boolean;
  handleProps?: any;
  height?: number;
  fadeIn?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  style?: React.CSSProperties;
  transition?: string | null;
  wrapperStyle?: React.CSSProperties;
  // value: React.ReactNode; // rename to children
  onRemove?: () => void;
  renderItem?: (ctx: {
    id: UniqueIdentifier;
    record: TRecord;

    nodes?: {
      Handle?: React.ReactNode;
    };

    dragOverlay: boolean;
    dragging: boolean;
    sorting: boolean;
    index: number | undefined;
    fadeIn: boolean;
    listeners: DraggableSyntheticListeners;
    // ref: React.Ref<HTMLLIElement>;
    style: React.CSSProperties | undefined;
    transform: ItemProps["transform"];
    transition: ItemProps["transition"];
    // value: Props['value'];
    children: ItemProps["children"];
  }) => React.ReactElement<any>;

  // attributes?: DraggableAttributes;

  ref?: React.Ref<HTMLLIElement>;
  className?: string;

  components?: {
    item?: {
      wrapper?: CustomizeComponent;
      content?: (ctx: {
        record: TRecord;
        index: number;
        children: React.ReactNode;
      }) => React.ReactNode;
    };
  };
}

export const Item = <TRecord extends AnyObject = AnyObject>({
  id,
  index,
  record,
  children,

  color,
  dragOverlay,
  dragging,
  disabled,
  fadeIn,
  handle,
  handleProps,
  height,
  listeners,
  onRemove,
  renderItem,
  sorting,
  style,
  transition,
  transform,
  // value,
  wrapperStyle,

  className,
  components,

  ref,
  ...props
}: ItemProps<TRecord>) => {
  useEffect(() => {
    if (!dragOverlay) {
      return;
    }

    document.body.style.cursor = "grabbing";

    return () => {
      document.body.style.cursor = "";
    };
  }, [dragOverlay]);

  const HandleComp = <Handle {...handleProps} {...listeners} />;

  const ItemWrapperComp = components?.item?.wrapper ?? "li";
  const ItemContentComp =
    components?.item?.content ?? (({ children }) => children);
  return renderItem ? (
    renderItem({
      record,
      index,
      dragOverlay: Boolean(dragOverlay),
      dragging: Boolean(dragging),
      sorting: Boolean(sorting),
      fadeIn: Boolean(fadeIn),
      listeners,
      // ref,
      style,
      transform,
      transition,
      // value,

      id,
      children,
      nodes: {
        Handle: HandleComp,
      },
    })
  ) : (
    <ItemWrapperComp
      data-slot="sortable-item"
      className={cn(
        "group/sortable-item",
        styles.Wrapper,
        fadeIn && styles.fadeIn,
        sorting && styles.sorting,
        dragOverlay && styles.dragOverlay,

        // from div
        styles.Item,
        dragging && styles.dragging,
        handle && styles.withHandle,
        dragOverlay && styles.dragOverlay,
        disabled && styles.disabled,
        color && styles.color,
        // own

        "cursor-default gap-2 px-3 py-1.5 text-sm",

        "shadow-[0_0_0_calc(1px/var(--scale-x,1))_rgba(63,63,68,0.05),0_1px_calc(3px/var(--scale-x,1))_0_rgba(34,33,81,0.15)]",
        "rounded-[calc(4px/var(--scale-x,1))]",
        className,
      )}
      // className={cn(
      //   "origin-[0_0] touch-manipulation",
      //   // own
      //   "group/sortable-item relative flex grow items-center justify-between text-sm",
      //   // "rounded-md border",
      //   disabled &&
      //     "bg-background-muted text-muted-foreground cursor-not-allowed",
      //   handle ? "cursor-default!" : "",

      //   // styles.Item,
      //   // dragging && styles.dragging,
      //   // handle && styles.withHandle,
      //   // dragOverlay && styles.dragOverlay,
      //   // disabled && styles.disabled,
      //   // color && styles.color
      // )}
      style={
        {
          ...wrapperStyle,
          transition,
          "--translate-x": transform
            ? `${Math.round(transform.x)}px`
            : undefined,
          "--translate-y": transform
            ? `${Math.round(transform.y)}px`
            : undefined,
          "--scale-x": transform?.scaleX ? `${transform.scaleX}` : undefined,
          "--scale-y": transform?.scaleY ? `${transform.scaleY}` : undefined,
          "--index": index,

          // transform:
          //   "translate3d(var(--translate-x, 0), var(--translate-y, 0), 0) scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1)) scale(var(--scale, 1))",

          // ...(dragOverlay
          //   ? {
          //       "--scale": 1.05,
          //       "--box-shadow": "$box-shadow",
          //       "--box-shadow-picked-up":
          //         "$box-shadow-border, -1px 0 15px 0 rgba(34, 33, 81, 0.01), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)",
          //       "z-index": 999,
          //     }
          //   : {}),

          // global-var
          // "--box-shadow-border":
          //   "0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05)",
          // "--box-shadow-common":
          //   "0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)",
          // "--box-shadow":
          //   "var(--box-shadow-border), var(--box-shadow-common)",
          ...style,
        } as React.CSSProperties
      }
      // {...attributes}
      // {...(handle ? undefined : listeners)}
      //{...props}
      // tabIndex={handle ? undefined : 0}
      ref={ref}
      data-cypress="draggable-item"
      {...(handle ? undefined : listeners)}
      {...props}
      tabIndex={handle ? undefined : 0}
    >
      {/* <div
        className={cn(
          // dragOverlay &&
          // "animation-[pop_200ms_cubic-bezier(0.18,0.67,0.6,1.22)] scale-(--scale) opacity-100 shadow-(--box-shadow-picked-up)",
          // dragging &&
          //   !dragOverlay &&
          //   "opacity-(--dragging-opacity, 0.5) z-0 focus:shadow-(--box-shadow)",
          // own
          // "relative flex grow items-center justify-between p-4 px-3 py-1.25",
          // "rounded-md border",
          // disabled &&
          //   "bg-background-muted text-muted-foreground cursor-not-allowed",

          // className,
          styles.Item,
          dragging && styles.dragging,
          handle && styles.withHandle,
          dragOverlay && styles.dragOverlay,
          disabled && styles.disabled,
          color && styles.color,
          // own

          "cursor-default gap-2 px-3 py-1.5 text-sm",

          "shadow-[0_0_0_calc(1px/var(--scale-x,1))_rgba(63,63,68,0.05),0_1px_calc(3px/var(--scale-x,1))_0_rgba(34,33,81,0.15)]",
          "rounded-[calc(4px/var(--scale-x,1))]",
          className,
        )}
        style={style}
        // style={
        //   {
        //     // ...style,
        //     // ...(dragging && !dragOverlay ? {
        //     //   opacity: "var(--dragging-opacity, 0.5);",
        //     //   zIndex: 0,
        //     //   boxShadow: "none"
        //     // }: {})
        //   }
        // }
        data-cypress="draggable-item"
        {...(handle ? undefined : listeners)}
        {...props}
        tabIndex={handle ? undefined : 0}
      > */}
      {handle ? HandleComp : null}
      {ItemContentComp({ record, index, children })}
      <span className={cn(styles.Actions, "flex items-center gap-2")}>
        {onRemove ? (
          <Remove className={styles.Remove} onClick={onRemove} />
        ) : undefined}
      </span>
      {/* </div> */}
    </ItemWrapperComp>
  );
};
