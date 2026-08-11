"use client";

import { useSecret } from "@context/SecretContext";
import React, { useEffect, useState } from "react";
import SecretView from "./secret-view";
import { achievements, secretGroups, secrets } from "types";
import "./secrets.css";

const SECRET_TAP_MIN = 5;

export default function SecretsView() {


  const [allUnlocked, setAllUnlocked] = useState(false);

  // useEffect(() => {

  //   if (!settings) return;

  //   const lockedCount = Object.values(settings).filter((s) => {
  //     if (!s) return true;
  //     return !s.isUnlocked;
  //   }).length;

  //   setAllUnlocked(lockedCount !== 0);

  // }, [settings]);

  return (
    <>
      <div className="modal-content modal-content-secrets text-white h-full grid">
        <table className="table-auto border-collapse mb-0 w-full">
          <thead className="">
            <tr className="">
            </tr>
          </thead>
          <tbody className="">
            {
              secretGroups && achievements &&
              secretGroups
                // .filter(group => {
                //   return group.items && group.items.length > 0;
                // })
                .map(group => {
                  const items = secrets.filter(s => {
                    if (!s) return false;
                    return s.type === group.type;
                  });
                  if (!items || items.length === 0) return null;
                  return (
                    <React.Fragment key={group.type}>
                      <tr className="bg-stone-900/90">
                        <th className="pt-1 lg:pt-3 pb-1 pl-3 text-left align-middle pointer-events-none select-none" colSpan={4}>
                          {group?.title}
                        </th>
                      </tr>
                      <tr className="content-center bg-stone-900/90 text-xs lg:text-lg">
                        <th className="border border-gray-400/25">
                          {/* <FontAwesomeIcon icon={faQuestionCircle} className="m-2 p-1 w-full h-full mx-auto my-auto" size="xl"
                            aria-label="Status" /> */}
                        </th>
                        <th className="p-2 border border-gray-400/25 font-semibold">
                          <span className="">Name</span>
                        </th>
                        <th className="p-2 border border-gray-400/25 font-semibold">
                          <span className="">Description</span>
                        </th>
                        <th className="p-2 border border-gray-400/25 font-semibold">
                          <span className="">Enabled</span>
                        </th>
                      </tr>
                      {
                        items && items.map(i => {
                          if (!i) return;
                          return (
                            <SecretView key={i.id} id={i.id} stat={i} unlockMinimum={SECRET_TAP_MIN} />
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
              <div className="align-middle grid min-h-25 pointer-events-none select-none">
                <p className="opacity-50 align-middle my-auto text-center mx-2">
                  {`Tip: You can tap on a hidden secret's name ${SECRET_TAP_MIN} times instead of unlocking them normally.`}
                </p>
              </div>
            </div>
          )
        }
      </div>
    </>
  );
};