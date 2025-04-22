/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect } from "react";

import type { AnyObject } from "@acme/ui";

import type { SortableItemDef } from "../types";
import { SortableContent } from "./sortable-content";
import { SortableItem } from "./sortable-item";
import { SortableOverlay } from "./sortable-overlay";
import { SortableRoot } from "./sortable-root";

type SortableProps<TRecord extends AnyObject = AnyObject> = {
  dataSource: SortableItemDef<TRecord>[];
  rowKey: keyof TRecord | ((record: SortableItemDef<TRecord>) => React.Key);
  renderItem?: (ctx: { record: SortableItemDef<TRecord> }) => React.ReactNode;
};
const Sortable = <TRecord extends AnyObject = AnyObject>({
  dataSource,
  rowKey,
  renderItem,
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
      }}
    >
      <SortableContent>
        {items.map((item, index) => renderInternalItem(item, index))}
      </SortableContent>
      <SortableOverlay>
        {({ item }) => <div>{renderInternalItem(item, 0).props.children}</div>}
      </SortableOverlay>
    </SortableRoot>
  );
};

export { Sortable };
