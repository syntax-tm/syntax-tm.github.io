"use client";

import React, { Suspense, useEffect, useState } from "react";
import { unstable_catchError as catchError, type ErrorInfo } from 'next/error';
import BackgroundView from "@src/components/background/background-view";
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
        <BackgroundView />
        <Clock />
      </Suspense>
      <div className="grid content-center z-100 w-full h-full text-white">
        {error && (
          <>
            <button
              onClick={
                // Attempt to recover by re-fetching and re-rendering the segment
                () => unstable_retry()
              }
              aria-label="Return to the home page">
              <div className="flex flex-col mt-[30%]">
                <div className="grid grid-cols-2 text-center text-lg lg:text-4xl hover:animate-pulse gap-1 lg:gap-4 px-auto">
                  <FontAwesomeIcon icon={faBug} className="" />
                  <div className="text-center">
                    {error.name}
                  </div>
                </div>
                <hr className="w-[80%] md:w-[60%] mx-auto my-1 md:my-5 border-gray-500 opacity-50" />
                <div className="grid text-center lg:text-2xl select-all">
                  <p>{error.message}</p>
                </div>
                {stackTrace && (
                  <div className="m-5">
                    <hr className="w-[80%] md:w-[60%] mx-auto my-1 md:my-5 border-gray-500 opacity-50" />
                    <div className="text-xl text-left m-2">
                      Stacktrace:
                    </div>
                    <div className="grid w-full mx-auto">
                      <table className="table-auto border border-collapse">
                        <thead>
                          <tr>
                            <th className="border border-gray-400/25"> </th>
                            <th className="border border-gray-400/25">File</th>
                            <th className="border border-gray-400/25">Line</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stackTrace.map((line) => {
                            return (
                              <tr key={line.id}>
                                <td className="text-center opacity-50 inline-block w-8">{line.id}</td>
                                <td className="text-left select-all overflow-clip text-ellipsis text-nowrap mx-2"
                                  title={line.line}>
                                  {line.file}
                                </td>
                                <td className="text-left select-all inline-block">{line.lineNo}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
