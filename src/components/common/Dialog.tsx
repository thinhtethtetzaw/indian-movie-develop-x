import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog as BaseDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/stores/useDialogStore";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

const classes = cva(
  "fixed z-[var(--z-dialog)] bg-popover w-[95%] sm:w-full rounded-xl max-h-[80vh] overflow-auto backdrop-blur-md sm:max-w-sm text-popover-foreground",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
      },
    },
  },
);

const Dialog = () => {
  const { dialog, hideDialog } = useDialogStore();

  const {
    isAlert,
    size = "sm",
    icon,
    title,
    description,
    descriptionClassName,
    className,
    titleClassName,
    onClose,
    children,
    action,
    cancel,
    showCloseButton = true,
  } = dialog || {};

  const handleAction = async () => {
    await action?.onClick?.();
    hideDialog();
  };

  const handleCancel = async () => {
    cancel?.onClick?.();
    hideDialog();
  };

  const renderDialogFooter = () => {
    return (
      <div className="flex justify-end space-x-1 sm:space-x-2">
        {cancel && (
          <Button
            variant={cancel.variant ?? "outline"}
            {...cancel}
            onClick={handleCancel}
            className={cn("text-muted-foreground", cancel.className)}
          >
            {cancel.label ?? "Cancel"}
          </Button>
        )}
        {action && (
          <Button
            {...action}
            onClick={handleAction}
            className={cn("text-muted-foreground", action.className)}
          >
            {action.label ?? "Confirm"}
          </Button>
        )}
      </div>
    );
  };

  const dialogContent = (
    <>{typeof children === "function" ? children() : children}</>
  );

  if (!dialog) return null;

  const alertDialogHeader = (
    icon?: ReactNode,
    title?: string,
    description?: string,
  ) => {
    return (
      <AlertDialogHeader className="gap-6">
        {icon && icon}
        <div className="flex flex-col gap-y-1">
          <AlertDialogTitle className={cn("text-white", titleClassName)}>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription
            className={cn("mt-4 text-white/80", descriptionClassName)}
          >
            {description}
          </AlertDialogDescription>
        </div>
      </AlertDialogHeader>
    );
  };

  if (isAlert) {
    return (
      <AlertDialog
        open={true}
        onOpenChange={(isOpen) => {
          !isOpen && hideDialog();
          onClose?.();
        }}
      >
        <AlertDialogContent className={cn(classes({ size: size, className }))}>
          {!!title || !!description || !!icon ? (
            alertDialogHeader(icon, title, description)
          ) : (
            <VisuallyHidden>
              {alertDialogHeader(icon, title, description)}
            </VisuallyHidden>
          )}
          {dialogContent}
          {(!!action || !!cancel) && (
            <AlertDialogFooter className="mt-4">
              {renderDialogFooter()}
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  const dialogHeader = (title?: string, description?: string) => {
    return (
      <DialogHeader>
        <DialogTitle
          className={cn(
            "text-title-lg font-semibold text-white",
            titleClassName,
          )}
        >
          {title}
        </DialogTitle>
        <DialogDescription
          className={cn("mt-4 text-white/80", descriptionClassName)}
        >
          {description}
        </DialogDescription>
      </DialogHeader>
    );
  };

  return (
    <BaseDialog
      open={true}
      onOpenChange={(isOpen) => {
        !isOpen && hideDialog();
        onClose?.();
      }}
    >
      <DialogContent
        className={cn(classes({ size: size, className }))}
        showCloseButton={showCloseButton}
      >
        {!!title || !!description ? (
          dialogHeader(title, description)
        ) : (
          <VisuallyHidden>{dialogHeader(title, description)}</VisuallyHidden>
        )}
        {dialogContent}
        {(!!action || !!cancel) && (
          <DialogFooter className="mt-4">{renderDialogFooter()}</DialogFooter>
        )}
      </DialogContent>
    </BaseDialog>
  );
};

export default Dialog;
