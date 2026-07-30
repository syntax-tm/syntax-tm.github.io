export type SnackbarType = {
  key: string;
  text: React.ReactNode;
  icon?: React.FunctionComponent<React.SVGProps<SVGElement>>;
}

export type SnackbarVariant = 'success' | 'warn' | 'error' | 'secret' | 'info' | 'lock' | 'unlock' | 'enable' | 'disable';

export type TSnackbarProps = Omit<SnackbarType, 'key'> & {
  handleClose: () => void;
  open: boolean;
  variant: SnackbarVariant;
}

export type KeyPressAction = {
    repeat: boolean;
    onKeyPress: () => void;
}
