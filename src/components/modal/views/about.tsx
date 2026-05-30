import { loadEnvConfig } from '@next/env'
import { faInfo, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import useMobileDetect from "@hooks/useMobileDetect";

function isMultiLine(text: string | undefined) {
  if (text === undefined) return false;
  return /\n/.test(text);
}

function getLines(text: string | undefined): string[] {
  if (text === undefined) return [];
  return text.split(/\r?\n/);
}

console.log('process.env:');
console.log(process);

const displayItems: Record<string, string | undefined> = {
  "Author": "Trey (@syntax-tm)",
  "Name": process.env.name,
  "Version": process.env.version,
  "Description": process.env.description,
  "Next.js": process.env.NEXT_PUBLIC_NEXTJS_VERSION,
  "Package Manager": process.env.packageManger,
  "Build Date": `${process.env.NEXT_PUBLIC_BUILD_DATE_LOCAL} ${process.env.NEXT_PUBLIC_BUILD_TIME_LOCAL} ${process.env.NEXT_PUBLIC_TZ_SHORT}`,
  "Dependencies": process.env.dependencies,
};

export const AboutView = () => {

  const mobileDetect = useMobileDetect();

  return (
    <div className="grid h-full p-1">
      <div className="modal-content content-center justify-items-center mx-auto md:w-[80%] overflow-y-auto overscroll-contain my-[2%] md:my-2">
        <table className="w-auto text-base rtl:text-right text-gray-500 dark:text-gray-400 max-w-[500px] -my-1">
          {/* <thead className="text-m text-gray-400 uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                Created By
              </th>
              <td scope="col" className="px-6 py-3">
                Trey (@syntax-tm)
              </td>
            </tr>
          </thead> */}
          <tbody className="">
          {
            Object.entries(displayItems).map(([key, value]) => (
              <tr className="" key={key}>
                <th scope="row" className="px-3 py-2.5 align-text-top text-sm md:text-base text-gray-500 whitespace-nowrap dark:text-gray-400 text-right">
                  {key}
                </th>
                <td className="px-3 py-2.5 text-wrap whitespace-normal text-left text-sm -indent-4 md:indent-0">
                  <div>
                    {
                      value !== null && isMultiLine(value) && getLines(value).map((line, index) => (
                        <p key={index}>{line}</p>
                      ))
                    }
                    {
                      !isMultiLine(value) && (
                        <p>{value}</p>
                      )
                    }
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
    </div>
  );
}
