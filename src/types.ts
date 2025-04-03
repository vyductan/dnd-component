import type { UniqueIdentifier } from "@dnd-kit/core";

import type { AnyObject } from "@acme/ui";

export type SortableItemDef<TRecord extends AnyObject = AnyObject> = {
  id: UniqueIdentifier;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
} & TRecord;
