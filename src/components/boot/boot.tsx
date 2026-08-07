"use client";

import React from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "@styles/components/boot.scss";

export default function Boot() {
  return (
    <React.Fragment>
      <div className="boot-default right-0">
        <div className="boot-content slide-in-out flex flex-col">
          <div className="fixed">

          </div>
          <div className="relative grid">
            <div className="text-3xl select-none">
              <FontAwesomeIcon icon={faSpinner} spin className="mr-4" />
              Loading
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
