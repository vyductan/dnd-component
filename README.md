# Dnd Component

<https://github.com/clauderic/dnd-kit/tree/master/stories>
Nov 24, 2024, 3:14 AM GMT+7

<https://github.com/clauderic/dnd-kit/commit/9175566442381c5e005510ee722a2e4d198986a1>

## Examples

```tsx
import { Sortable } from "@ui/dnd";

const items = [
  { id: "1", name: "Item 1" },
  { id: "2", name: "Item 2" },
  { id: "3", name: "Item 3" },
];

const App = () => {
  return <Sortable items={items} onDragEnd={(activeIndex, overIndex) => {}} />;
};
```
