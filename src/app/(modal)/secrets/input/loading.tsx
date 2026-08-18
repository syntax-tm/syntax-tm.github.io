import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRing } from "@fortawesome/free-solid-svg-icons";

export default function Loading() {
  return (
    <>
      <div className="loading flex flex-row gap-4 text-white">
        <FontAwesomeIcon icon={faRing} spin className="my-auto align-middle" />
        <div className="loading-text">
          Loading...
        </div>
      </div>
    </>
  );
}