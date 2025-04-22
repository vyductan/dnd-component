export const DragHandle = () => {
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
