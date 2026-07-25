"use client";

import React, { Suspense, useEffect, useState } from "react";
import { unstable_catchError as catchError, type ErrorInfo } from 'next/error';
import Background from "@components/background/background";
import Clock from "@components/clock/Clock";
//import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import "@styles/global.css";
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
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {

  const [stackTrace, setStackTrace] = useState<StackTraceFrame[] | null>(null);

  useEffect(() => {
    // log the error to an error reporting service
    console.error(error);
  }, [error]);

  useEffect(() => {
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
  }, []);

  return (
    <div className="root-container">
      <Suspense>
        <Background />
        <Clock />
      </Suspense>
      <div className="grid content-center z-100 overflow-hidden absolute left-0 top-0 w-full h-screen text-white">
        {error && (
          <>
            <button
              onClick={
                // Attempt to recover by re-fetching and re-rendering the segment
                () => unstable_retry()
              }
              aria-label="Return to the home page">
              <div className="flex flex-row justify-center items-center text-4xl hover:animate-pulse gap-4">
                <FontAwesomeIcon icon={faBug} className="object-contain justify-self-center" />
                <span className="text-center">
                  {error.name}
                </span>
              </div>
              <hr className="w-[80%] md:w-[60%] mx-auto my-1 md:my-5 border-gray-500 opacity-50" />
              <div className="flex flex-row justify-center items-center text-2xl select-all">
                <p>{error.message}</p>
              </div>
              {stackTrace && (
                <div className="m-5">
                  <hr className="w-[80%] md:w-[60%] mx-auto my-1 md:my-5 border-gray-500 opacity-50" />
                  <div className="text-xl text-left m-2">
                    Stacktrace:
                  </div>
                  <div className="grid w-full overflow-scroll mx-auto max-h-[60%]">
                    {stackTrace.map((line) => {
                      return (
                        <>
                          <div className="flex">
                            <div className="text-center opacity-50 inline-block w-8">{line.id}</div>
                            <div className="text-right select-all overflow-clip text-ellipsis text-nowrap w-auto max-w-[80%] mx-2"
                              dir="rtl"
                              title={line.line}>
                              {line.file}
                            </div>
                            <div className="text-left select-all inline-block w-8">{line.lineNo}</div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
