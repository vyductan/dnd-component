/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect } from "react";

import type { AnyObject } from "@acme/ui";

import type { SortableItemDef } from "../types";
import { SortableContent } from "./sortable-content";
import { SortableItem } from "./sortable-item";
import { SortableOverlay } from "./sortable-overlay";
import { SortableRoot, SortableRootProps } from "./sortable-root";

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

  classNames?: {
    content?: string;
  };
  withOverlay?: boolean;
};
const Sortable = <TRecord extends AnyObject = AnyObject>({
  dataSource,
  rowKey,
  renderItem,

  onChange,

  classNames,
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

    if (!key) {
      key = `sortable-item-${index}`;
    }
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
      <SortableContent className={classNames?.content}>
        {items.map((item, index) => renderInternalItem(item, index))}
      </SortableContent>
      {withOverlay && (
        <SortableOverlay>
          {({ item }) => renderInternalItem(item, 0).props.children}
        </SortableOverlay>
      )}
    </SortableRoot>
  );
};

export { Sortable };
