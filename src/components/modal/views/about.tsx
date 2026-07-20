import React, { useEffect, useRef } from "react";
import useMobileDetect from "@/hooks/useMobileDetect";
import { useSecret } from "@/context/SecretContext";

function isMultiLine(text: string | undefined) {
  if (text === undefined) return false;
  return /\n/.test(text);
}

function getLines(text: string | undefined): string[] {
  if (text === undefined) return [];
  return text.split(/\r?\n/);
}

const displayItems: Record<string, string | undefined> = {
  "Author": "Trey (@syntax-tm)",
  "Name": process.env.name,
  "Version": process.env.version,
  "Description": process.env.description,
  "Next.js": process.env.NEXT_PUBLIC_NEXTJS_VERSION,
  "Package Manager": process.env.packageManger,
  "Build Date": `${process.env.NEXT_PUBLIC_BUILD_DATE_LOCAL} ${process.env.NEXT_PUBLIC_BUILD_TIME_LOCAL} ${process.env.NEXT_PUBLIC_TZ_SHORT}`,
  "Dependencies": process.env.dependencies,
};

const SECRET_TAP_MIN = 5;

export const AboutView = () => {
  const mobileDetect = useMobileDetect();
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<number | null>(null);
  const { toggleSecret } = useSecret();

  useEffect(() => {
    if (!mobileDetect.isMobile()) return;

    const resetTapCount = () => {
      tapCountRef.current = 0;
      if (tapTimerRef.current) {
        window.clearTimeout(tapTimerRef.current);
        tapTimerRef.current = null;
      }
    };

    const handleTouchEnd = () => {
      tapCountRef.current += 1;

      if (tapTimerRef.current) {
        window.clearTimeout(tapTimerRef.current);
      }

      tapTimerRef.current = window.setTimeout(() => {
        tapCountRef.current = 0;
        tapTimerRef.current = null;
      }, 500);

      if (tapCountRef.current >= SECRET_TAP_MIN) {
        toggleSecret();
        resetTapCount();
      }
    };

    document.body.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.body.removeEventListener("touchend", handleTouchEnd);
      resetTapCount();
    };
  }, [mobileDetect]);

  return (
    <div className="grid h-full p-1">
      <div className="modal-content content-center justify-items-center mx-auto md:w-[80%] overflow-y-auto overscroll-contain my-[2%] md:my-2">
        <table className="w-auto text-base rtl:text-right text-gray-500 dark:text-gray-400 max-w-[500px] -my-1">
          <tbody className="">
            {
              Object.entries(displayItems).map(([key, value]) => (
                <tr className="" key={key}>
                  <th scope="row" className="px-3 py-2.5 text-sm md:text-base text-gray-300 whitespace-nowrap dark:text-gray-300 text-right">
                    <span className="inline-block align-baseline select-none">{key}</span>
                  </th>
                  <td className="px-3 py-2.5 text-wrap whitespace-normal text-left text-sm md:text-base -indent-4 md:indent-0">
                    <div className="grid grid-cols-1">
                      {
                        value !== null && isMultiLine(value) && getLines(value).map((line, index) => (
                          <span key={index} className="inline-block align-baseline text-gray-400 dark:text-gray-400 select-all">
                            {line}
                          </span>
                        ))
                      }
                      {
                        !isMultiLine(value) && (
                          <span className="inline-block align-baseline select-none">{value}</span>
                        )
                      }
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};
