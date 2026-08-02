"use client";

import { SecretGroupType, useSecret } from "@context/SecretContext";
import React, { useEffect, useState } from "react";
import SecretView from "./secret-view";
import "./secrets.css";

const SECRET_TAP_MIN = 5;

export default function SecretsView() {

  const { stats, secretGroups } = useSecret();
  const [allUnlocked, setAllUnlocked] = useState(false);

  useEffect(() => {

    if (!stats) return;

    const lockedCount = Array.from(stats).filter(([, stat]) => {
      return !stat.isUnlocked;
    }).length;

    setAllUnlocked(lockedCount !== 0);

  }, [stats]);

  return (
    <>
      <div className="modal-content modal-content-secrets text-white h-full grid">
        <table className="table-auto border-collapse mb-0 w-full">
          <thead className="bg-gray-600/40">
            <tr className="content-center">
              <th className=" text-sm md:text-lg border border-gray-400/25">
                {/* <FontAwesomeIcon icon={faQuestionCircle} className="m-2 p-1 w-full h-full mx-auto my-auto" size="xl"
                  aria-label="Status" /> */}
              </th>
              <th className="p-2 text-sm md:text-lg border border-gray-400/25">Name</th>
              <th className="p-2 text-sm md:text-lg border border-gray-400/25">Description</th>
              <th className="p-2 text-sm md:text-lg border border-gray-400/25">Enabled</th>
            </tr>
          </thead>
          <tbody className="bg-gray-600/40">
            {
              stats &&
              Array.from(Object.keys(secretGroups)).map(g => {
                const type = g as SecretGroupType;
                const group = secretGroups[type];
                const items = Array.from(stats).filter(stat => {
                  if (type === 'default') return stat[1].stat.type === undefined;
                  return stat[1].stat.type === type;
                });
                return (
                  <React.Fragment key={g}>
                    <tr className="">
                      <th className="text-lg md:text-xl py-2 lg:py-5 pl-2 my-2 text-left align-middle pointer-events-none select-none" colSpan={4}>
                        {group.title}
                      </th>
                    </tr>
                    {
                      items && items.map(([id, stat]) => {
                        return (
                          <SecretView key={id} id={id} stat={stat} unlockMinimum={SECRET_TAP_MIN} />
                        );
                      })
                    }
                  </React.Fragment>
                );
              })
            }
          </tbody>
        </table>
        {
          allUnlocked && (
            <div className="h-full w-full grid">
              <p className="opacity-50 align-middle my-auto text-center mx-2">
                {`Tip: You can tap on a hidden secret's name ${SECRET_TAP_MIN} times instead of unlocking them normally.`}
              </p>
            </div>
          )
        }
      </div>
    </>
  );
};