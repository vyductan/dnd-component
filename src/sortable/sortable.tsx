/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect } from "react";

import type { AnyObject } from "@acme/ui/types";

import type { SortableItemDef } from "../types";
import type { SortableRootProps } from "./sortable-root";
import { SortableContent } from "./sortable-content";
import { SortableItem } from "./sortable-item";
import { SortableOverlay } from "./sortable-overlay";
import { SortableRoot } from "./sortable-root";

type SortableProps<TRecord extends AnyObject = AnyObject> = Pick<
  SortableRootProps<TRecord>,
  | "orientation"
  | "flatCursor"
  | "activationConstraint"
  | "collisionDetection"
  | "coordinateGetter"
  | "onChange"
> & {
  dataSource: SortableItemDef<TRecord>[];
  rowKey: keyof TRecord | ((record: SortableItemDef<TRecord>) => React.Key);
  renderItem?: (ctx: { record: SortableItemDef<TRecord> }) => React.ReactNode;

  className?: string;
  withOverlay?: boolean;
};
const Sortable = <TRecord extends AnyObject = AnyObject>({
  dataSource,
  rowKey,
  renderItem,

  onChange,

  className,
  withOverlay = true,
  ...props
}: SortableProps<TRecord>) => {
  const [items, setItems] = React.useState(dataSource);
  useEffect(() => {
    setItems(dataSource);
  }, [dataSource]);

  const renderInternalItem = (
    item: SortableItemDef<TRecord>,
    index: number,
  ) => {
    let key: any;

    if (typeof rowKey === "function") {
      key = rowKey(item);
    } else if (rowKey) {
      key = item[rowKey];
    } else {
      key = item.key;
    }

    key ??= `sortable-item-${index}`;

    return renderItem ? (
      <React.Fragment key={key}>{renderItem({ record: item })}</React.Fragment>
    ) : (
      <SortableItem key={key} id={key}>
        {key}
      </SortableItem>
    );
  };
  return (
    <SortableRoot
      items={items}
      onChange={(items) => {
        setItems(items);
        onChange?.(items);
      }}
      {...props}
    >
      <SortableContent className={className}>
        {items.map((item, index) => renderInternalItem(item, index))}
      </SortableContent>
      {withOverlay && (
        <SortableOverlay>
          {({ item }) =>
            renderInternalItem(item, 0).props.children as React.ReactNode
          }
        </SortableOverlay>
      )}
    </SortableRoot>
  );
};

export { Sortable };
