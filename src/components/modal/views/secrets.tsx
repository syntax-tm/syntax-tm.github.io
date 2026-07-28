"use client";

import React from "react";
import { useSecret } from "@context/SecretContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faLock, faUnlock, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";

export interface SecretsViewProps
{
  title: string;
  description?: string;
}

export const SecretsView = ({ title, description }: SecretsViewProps) => {

  const { stats } = useSecret();

  return (
    <>
      <div className="w-full h-full text-white my-auto">
        <table className="table-auto border-collapse mx-auto w-full my-auto">
          <thead className="">
            <tr className="content-center">
              <th className=" bg-gray-800 text-sm md:text-md border border-gray-400/25">
                <FontAwesomeIcon icon={faQuestionCircle} className="m-2 p-1 w-full h-full mx-auto my-auto" />
              </th>
              <th className="p-2 bg-gray-800 text-sm border border-gray-400/25">Name</th>
              <th className="p-2 bg-gray-800 text-sm border border-gray-400/25">Description</th>
            </tr>
          </thead>
          <tbody className="bg-gray-600/40">
            {
              stats && Array.from(stats).map(([id, stat]) => {
                return (
                  <tr key={id} className="">
                    <td className={`border-b border-gray-400/25 text-center ${stat.isUnlocked ? 'bg-green-300/50' : 'bg-gray-700'}`}>
                      <FontAwesomeIcon icon={stat.isUnlocked ? faUnlockAlt : faLock}
                        className={`py-3 w-full h-full mx-auto`} size="xl" />
                    </td>
                    <td className={`border border-gray-300/25 text-ellipsis text-nowrap text-xs md:text-lg px-2 ${!stat.isUnlocked && 'text-gray-400'}`}>
                      {stat.isUnlocked ? stat.stat?.title : 'Hidden'}
                    </td>
                    <td className={`border border-gray-300/25 text-ellipsis text-nowrap text-xs md:text-lg px-2 ${!stat.isUnlocked && 'text-gray-400'}`}>
                      {stat.isUnlocked ? stat.stat?.description : 'Hidden'}
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    </>
  );
};