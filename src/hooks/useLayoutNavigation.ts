import { useRouter } from "next/navigation";
import { useLayoutStore } from "@stores";

export const useLayoutNavigation = () => {
  const router = useRouter();
  const { isOpen, setIsOpen, setShouldClose, shouldClose } = useLayoutStore();

  const push = (name: string) => {
    router.push(`/wii/${name}`);
  };

  const open = () => {
    setIsOpen(true);
    setShouldClose(true);
  };

  const close = () => {
    if (shouldClose) {
      setIsOpen(false);
      setTimeout(() => {
        router.back();
      }, 1500);
    }
  };

  return { isOpen, open, close, push, setIsOpen, shouldClose };
};

export { useLayoutNavigation as default };
