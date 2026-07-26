"use client";

import React from "react";
import { useSecret } from "@context/SecretContext";
import "./xmb.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faLock, faLockOpen, faUnlock, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";

export interface SecretsViewProps
{
  title: string;
  description?: string;
}

export const SecretsView = ({ title, description }: SecretsViewProps) => {

  const { stats } = useSecret();

  return (
    <>
      <div className="my-auto mx-auto grid grid-cols-1 w-full h-full justify-items-center">
        <div className="relative my-auto">
          <div className="flex mb-2 ">
            <label className="text-lg sm:text-xl my-auto opacity-50 text-white grow align-bottom mb-1">
              {title}
            </label>
            {description && (
              <FontAwesomeIcon icon={faQuestionCircle} className="w-5 h-5 mb-1 opacity-25 hover:opacity-100 align-self-end justify-self-end text-white justify-right"
                title={description} />
            )}
          </div>
          <div className="grid grid-cols-2 grid-rows-1 relative w-fit max-w-150 text-ellipsis">
            <table>
              <thead>
                <tr>
                  <th> </th>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {
                  stats && Array.from(stats).map(([id, stat]) => {
                    return (
                      <tr key={id}>
                        <td>
                          <FontAwesomeIcon icon={stat.isUnlocked ? faUnlock : faLock} />
                        </td>
                        <td>
                          <span className="font-semibold">{stat.stat.title}</span>
                        </td>
                        <td>
                          <span>{stat.stat.description}</span>
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};