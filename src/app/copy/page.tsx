"use client";

import React, { useEffect } from "react";
import { faCheckCircle, faCopy, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useSnackbar } from "@context/SnackbarContext";
import { Modal } from "@components/modal/modal";
import { useRouter, useSearchParams } from "next/navigation";

export interface CopyViewProps
{
  name: string;
  description?: string;
  value: string;
}

export const CopyView = ({ name, description, value }: CopyViewProps) => {

  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(false);

  const { showSnackbar } = useSnackbar();

  return (
    <>
      <div className="my-auto mx-auto grid grid-cols-1 w-full h-full justify-items-center">
        <div className="relative my-auto">
          <div className="flex mb-2 ">
            <label className="text-lg sm:text-xl my-auto opacity-50 text-white grow align-bottom mb-1">
              {name}
            </label>
            {description && (
              <FontAwesomeIcon icon={faQuestionCircle} className="w-5 h-5 mb-1 opacity-25 hover:opacity-100 align-self-end justify-self-end text-white justify-right"
                title={description} />
            )}
          </div>
          <div className="grid grid-cols-2 grid-rows-1 relative w-fit max-w-150 text-ellipsis">
            <input type="text"
              readOnly
              title="Click to copy."
              className={`text-lg sm:text-xl p-2 my-auto col-span-2 bg-gray-800 hover:bg-gray-700 hover:bg-opacity-25 text-white border-2 border-white-500 hover:text-blue-300 hover:border-blue-300 rounded ${copied && 'disabled'}`}
              value={value}
              onMouseLeave={() => {
                setHover(false);
              }}
              onMouseEnter={() => {
                setHover(true);
              }}
              onClick={(e => {
                //if (copied) return;

                const el = e.target as HTMLInputElement;
                const value = el.value;

                navigator.clipboard.writeText(el.value);

                console.log(`Copied ${value} to clipboard.`);

                setCopied(true);

                showSnackbar(`Copied "${value}" to clipboard.`, "info");
              })} />
            <div className="absolute justify-self-end items-center h-full content-center">
              {
                !copied && (<FontAwesomeIcon icon={faCopy} className={`opacity-50 aspect-square my-auto h-5 w-5 mr-2 pointer-events-none ${hover ? 'text-blue-300' : 'text-white'}`} />)
              }
              {
                copied && (<FontAwesomeIcon icon={faCheckCircle} className={`opacity-50 aspect-square my-auto h-5 w-5 mr-2 pointer-events-none ${hover ? 'text-green-300' : 'text-green-500'}`} />)
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function CopyPage() {

  const searchParams = useSearchParams();
  const router = useRouter();
  const title = searchParams.has("title") ? decodeURIComponent(searchParams.get("title")) : '';
  const name = searchParams.has("name") ? decodeURIComponent(searchParams.get("name")) : '';
  const description = searchParams.has("description") ? decodeURIComponent(searchParams.get("description")) : '';
  const value = searchParams.has("value") ? decodeURIComponent(searchParams.get("value")) : '';

  if (!title || !name || !value) {
    let message = `Copy modal dialog is missing one or more required paramters.\n`;
    message += `\ntitle: ${title}\nname: ${name}\ndescription: ${description}\nvalue: ${value}`;
    console.error(message);
    alert(message);

    //router.push('/');

    return;
  }

  return (
    <>
      <Modal title={title}>
        <div className=" w-full h-[70%]">
          <CopyView name={name} description={description || ''} value={value} />
        </div>
      </Modal>
    </>
  );
}
