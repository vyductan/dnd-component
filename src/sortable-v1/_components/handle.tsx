import type { ButtonProps } from "@acme/ui/components/button";
import { Button } from "@acme/ui/components/button";
import { Icon } from "@acme/ui/icons";

export const Handle = (props: ButtonProps) => {
  return (
    <Button
      size="sm"
      data-cypress="draggable-handle"
      variant="ghost"
      icon={<Icon icon="icon-[octicon--grabber-16]" />}
      {...props}
    />
  );
};
