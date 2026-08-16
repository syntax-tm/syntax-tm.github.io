import { SnackbarItem } from "./snackbar-item";
import { SnackbarVariant } from "./snackbar-variant";

export type TSnackbarProps = Omit<SnackbarItem, 'key'> & {
  handleClose: () => void;
  open: boolean;
  variant: SnackbarVariant;
}

export { TSnackbarProps as default };
