import { useEffect, useState } from "react";
import { InputType } from "@/app/enums";
import { useGamepads } from "awesome-react-gamepads";

const getInputType = (userAgent: NavigatorID["userAgent"]) => {
  const [isGamepadConnected, setIsGamepadConnected] = useState(false);
  const [inputType, setInputType] = useState<InputType>(InputType.UNKNOWN);

  useGamepads({
    onConnect: () => {
      setIsGamepadConnected(true);
    },
    onDisconnect: () => {
      setIsGamepadConnected(false);
    },
  });

  const getInputType = () => {
    // gamepad
    if (isGamepadConnected) {
      return InputType.GAMEPAD;
    }

    // mobile
    const isAndroid = Boolean(userAgent.match(/Android/i));
    const isIos = Boolean(userAgent.match(/iPhone|iPad|iPod/i));
    const isOpera = Boolean(userAgent.match(/Opera Mini/i));
    const isIEMobile = Boolean(userAgent.match(/IEMobile/i));
    const isMobile = isAndroid || isIos || isOpera || isIEMobile;
    if (isMobile) {
      return InputType.TOUCH;
    }

    // default (desktop)
    return InputType.DEFAULT;
  };

  useEffect(() => {
    const type = getInputType();
    setInputType(type);
    return () => { };
  }, [userAgent, isGamepadConnected]);

  return inputType;
};

const useInput = () => {
  useEffect(() => { }, []);
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent;
  return getInputType(userAgent);
};

export default useInput;
