import React, { forwardRef } from "react";

import { cn } from "@acme/ui";

export interface Props {
  children: React.ReactNode;
  columns?: number;
  style?: React.CSSProperties;
  horizontal?: boolean;
  className?: string;
}

export const List = forwardRef<HTMLUListElement, Props>(
  (
    { children, columns = 1, horizontal, style, className, ...props }: Props,
    ref,
  ) => {
    return (
      <ul
        ref={ref}
        style={
          {
            ...style,
            "--columns": columns,
          } as React.CSSProperties
        }
        // style={{
        //   ...style,
        //   gridTemplateColumns: `repeat(${columns}, 1fr)`,
        // }}
        className={cn(
          "grid w-full auto-rows-max grid-cols-(--columns) gap-2 rounded-md",
          horizontal && "grid-flow-col",
          className,
        )}
        {...props}
      >
        {children}
      </ul>
    );
  },
);
