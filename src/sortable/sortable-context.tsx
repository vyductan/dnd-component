import type { SortableContextProps as SortableContextPropsCore } from "@dnd-kit/sortable";
import { SortableContext as SortableContextCore } from "@dnd-kit/sortable";

type SortableContextProps = SortableContextPropsCore;

const SortableContext = ({
  items,
  strategy,
  ...props
}: SortableContextProps) => {
  return <SortableContextCore items={items} strategy={strategy} {...props} />;
};

export type { SortableContextProps };
export { SortableContext };
