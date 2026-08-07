import "./dreamcast-background.scss";

export default function DreamcastBackground() {
  return (
    <>
      <div className={`background secret-background dreamcast-bg fixed top-0 left-0 w-screen h-screen -z-100 pointer-events-none overflow-hidden`}></div>
    </>
  );
}