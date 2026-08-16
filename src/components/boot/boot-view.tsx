import { BackgroundView } from "@components/background/background-view";
import { useTheme } from "@context";
import { Boot } from "./boot";

export function BootView() {
  const { currentTheme, font, boot } = useTheme();

  const themeClassName = currentTheme ? currentTheme.className : 'default-theme';
  const fontClassName = font ? font.className : 'default-font';
  const bootBg = boot?.showBackground ? <BackgroundView /> : null;
  const bootView = boot?.element ?? <Boot />;

  return (
    <div className={`boot-container ${themeClassName} ${fontClassName}`}>
      {bootBg}
      {bootView}
    </div>
  );
}

export { BootView as default };
