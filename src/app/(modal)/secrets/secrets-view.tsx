"use client";

import React, { useEffect, useRef, useState } from "react";
import { StoreApi, ExtractState } from "zustand";
import { StorageValue } from "zustand/middleware";
import SecretView from "./secret-view";
import { AchievementId, achievements, secretGroups, secrets, Setting, StatGroupDefinition } from "types";
import "./secrets.scss";
import { SettingState } from "@stores";

const SECRET_TAP_MIN = 5;



export default function SecretsView() {

  const tableRef = useRef<HTMLTableElement | null>(null);
  const [activeCell, setActiveCell] = useState<[number, number]>([0, 0]);
  //const [allUnlocked, setAllUnlocked] = useState(false);
  const allUnlocked = false;

  const totalRows = secrets.length;
  const totalCols = 4;

  const isUnlocked = (id: AchievementId) => {
    if (typeof localStorage === "undefined") return;
    const settingJson = localStorage.getItem(id);
    try
    {
      const state = JSON.parse(settingJson ?? '{}') as StorageValue<SettingState>;
      return state.state.isUnlocked;
    }
    catch
    {
      return false;
    }
  };

  const showGroupTitle = (group: StatGroupDefinition) => {
    const items = secrets.filter(s => s.type === group.type);
    if (!items) return false;
    if (!group.isHidden) return true;
    items.forEach(i => {
      if (isUnlocked(i.id)) return true;
    });
    return false;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
    const [row, col] = activeCell;

    console.log(`[${row}, ${col}] -> ${e.key}`);

    switch (e.key) {
      case "ArrowUp":
      case "W":
        e.preventDefault();
        e.stopPropagation();
        if (row > 0) setActiveCell([row - 1, col]);
        else setActiveCell([totalRows - 1, col]);
        break;
      case "ArrowDown":
      case "S":
        e.preventDefault();
        e.stopPropagation();
        if (row < totalRows - 1) setActiveCell([row + 1, col]);
        else setActiveCell([0, col]);
        break;
      case "ArrowLeft":
      case "A":
        e.preventDefault();
        e.stopPropagation();
        if (col > 0) setActiveCell([row, col - 1]);
        else setActiveCell([row, totalCols - 1]);
        break;
      case "ArrowRight":
      case "D":
        e.preventDefault();
        e.stopPropagation();
        if (col < totalCols - 1) setActiveCell([row, col + 1]);
        else setActiveCell([row, 0]);
        break;
      case "Home":
        e.preventDefault();
        e.stopPropagation();
        setActiveCell([row, 0]);
        break;
      case "End":
        e.preventDefault();
        e.stopPropagation();
        setActiveCell([row, totalCols - 1]);
        break;
      case "Tab":
        e.preventDefault();
        e.stopPropagation();
        const isShift = e.shiftKey;
        if (isShift) {
          if (col <= 0) { setActiveCell([row, totalCols - 1]); }
          else { setActiveCell([row, col - 1]); }
          return;
        }
        if (col >= totalCols - 1) setActiveCell([row, 0]);
        else setActiveCell([row, col + 1]);
      default:
        break;
    }
  };

  useEffect(() => {
    if (!tableRef.current) return;
    const cellElement = tableRef.current.querySelector(
      `[data-row="${activeCell[0]}"][data-col="${activeCell[1]}"]`,
    ) as HTMLTableCellElement;

    if (cellElement) {
      const validChild = cellElement.firstChild as HTMLElement;

      if (validChild && validChild.nodeType === Node.ELEMENT_NODE) {
        console.log(`${validChild.nodeName} focusing`);
        validChild.focus();
        return;
      }
      cellElement.focus();
    }
  }, [activeCell]);

  // const setActiveRow = useCallback((x: number) => {
  //   if (!tableRef.current) return;
  //   const tr = tableRef.current.querySelector(`tr[data-row="${x}"]`) as HTMLTableRowElement;
  //   tr?.focus();
  // }, []);

  let rowIndex = 0;

  return (
    <>
      <div className="modal-content modal-content-secrets text-white h-full grid">
        <table className="secrets-table table-auto border-collapse mb-0 w-full" ref={tableRef}
          onKeyDown={handleKeyDown}>
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
                .filter(group => {
                  return group.type !== "META";
                })
                .map(group => {
                  const items = secrets.filter(s => {
                    if (!s) return false;
                    return s.type === group.type;
                  });
                  if (!items || items.length === 0) return null;

                  const showTitle = showGroupTitle(group);
                  const title = showTitle ? group.title : 'Hidden';

                  return (
                    <React.Fragment key={group.type}>
                      <tr className="bg-stone-900/90">
                        <th className={`pt-1 lg:pt-3 pb-1 pl-3 text-left align-middle pointer-events-none select-none ${showTitle || 'text-white/50'}`} colSpan={4}>
                          {title}
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
                        items && items.map((i) => {
                          if (!i) return;
                          return (
                            <SecretView key={i.id} id={i.id} index={rowIndex++} stat={i} activeCell={activeCell} setActiveCell={setActiveCell} unlockMinimum={SECRET_TAP_MIN} />
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