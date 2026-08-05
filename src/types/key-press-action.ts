export type KeyPressAction = {
    repeat: boolean;
    onKeyPress: () => void | Promise<void>;
}
