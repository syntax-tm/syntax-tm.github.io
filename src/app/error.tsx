"use client";

import React, { Suspense, useEffect, useState } from "react";
import BackgroundView from "@components/background/background-view";
import Clock from "@components/clock/clock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import "@styles/global.scss";
import "./not-found.css";

//const Clock = dynamic(() => import('@components/clock/Clock'));

interface StackTraceFrame {
  id: number,
  lineNo?: number,
  file?: string,
  line?: string,
}

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  const [stackTrace, setStackTrace] = useState<StackTraceFrame[] | null>(null);

  useEffect(() => {
    // log the error to an error reporting service
    console.error(error);

    const lines = error?.stack?.split('\n');

    if (!lines) return;

    const stack: StackTraceFrame[] = lines.map(line => line.trim())
      .filter(line => line.startsWith('at '))
      .map((line, id) => {
        const match = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/) ||
                      line.match(/at\s+(.+?):(\d+):(\d+)/);

        if (!match) {
          return {
            id,
            line,
          };
        }

        const [,, file, lineNum] = match;

        const frame: StackTraceFrame = {
          id,
          lineNo: parseInt(lineNum),
          file,
          line,
        };

        return frame;
      });

    setStackTrace(stack);
  }, [error]);

  return (
    <div className="root-container">
      <BackgroundView />
      <Clock />
      <div className="flex flex-col absolute left-0 top-0 z-0 w-full h-full text-white">
        {error && (
          <>
            <button
              onClick={
                // Attempt to recover by re-fetching and re-rendering the segment
                () => reset()
              }
              aria-label="Return to the home page">
              
            </button>
            <div className="flex flex-col mt-[15%]">
              <div className="grid items-center justify-center">
                <div className="flex flex-row text-center text-6xl lg:text-8xl hover:animate-pulse gap-1 lg:gap-4 px-auto">
                  <div className="p-3">
                    <FontAwesomeIcon icon={faBug} className="my-auto" />
                  </div>
                  <div className="text-center align-middle place-content-center">
                    {error.name}
                  </div>
                </div>
              </div>
              <hr className="w-[80%] md:w-[60%] mx-auto my-1 md:my-2 border-white/75" />
              <div className="grid text-center lg:text-xl select-all relative">
                <p>{error.message}</p>
              </div>
              <hr className="w-[80%] md:w-[60%] mx-auto my-1 md:my-2 border-white/75" />
              {error?.stack && (
                <div className="max-w-[90%]">
                  <div className="p-2 font-mono text-nowrap whitespace-pre overflow-y-scroll overflow-x-scroll">
                    {error?.stack}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
