import { BackgroundView } from "@components/background/background-view";
import { useBoot, useTheme } from "@context";
import { Boot } from "./boot";
import { useEffect } from "react";
import { KeyPressAction } from "types";
import { useKeyboard, useDoubleTap } from "@hooks";

export function BootView() {
  const { currentTheme, font, boot } = useTheme();
  const { hideBootScreen } = useBoot();

  const actions = new Map<string, KeyPressAction>([
    ['escape', { repeat: false, onKeyPress: hideBootScreen }],
    ['enter', { repeat: false, onKeyPress: hideBootScreen }],
  ]);

  useDoubleTap({
    onDoubleTap: hideBootScreen,
    delay: 500,
  });

  useKeyboard({
    actions: actions,
    enabledOnModal: false,
  });

  const themeClassName = currentTheme ? currentTheme.className : 'default-theme';
  const fontClassName = font ? font.className : 'default-font';
  const bootBg = boot?.showBackground ? <BackgroundView /> : null;
  const bootView = boot?.element ?? <Boot />;

  // allows the user to double click to skip the boot screen
  useEffect(() => {

    const onClick = () => {
      hideBootScreen();
    };

    document.addEventListener('dblclick', onClick);

    return () => {
      document.removeEventListener('dblclick', onClick);
    };

  }, []);

  return (
    <div className={`boot-container ${themeClassName} ${fontClassName} pointer-events-auto z-200`}>
      {bootBg}
      {bootView}
    </div>
  );
}

export { BootView as default };
