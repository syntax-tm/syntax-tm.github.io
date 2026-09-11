import { useSecret, useXmb } from "@context";

export const DebugView = () => {

  const { x, y, item, category } = useXmb();
  const { currentSetting } = useSecret();

  return (
    <div className="absolute z-0 pointer-events-none bottom-0 right-0 flex flex-col gap-x-2 bg-zinc-900 text-white p-5 min-w-80">

      <table className="table-fixed">
        <thead>
          <tr>
            <th colSpan={2}></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th colSpan={4} className="p-2">XMB State</th>
          </tr>
          <tr>
            <th scope="row" className="">Position:</th>
            <td className="font-mono">({x}, {y})</td>
          </tr>
          <tr>
            <th scope="row" title="Category">Cat:</th>
            <td className="font-mono">{category}.{item}</td>
          </tr>
          <tr>
            <th colSpan={2} className="p-2">Secret State</th>
          </tr>
          <tr>
            <th scope="row">Secret:</th>
            <td className="font-mono">{currentSetting}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export { DebugView as default };
