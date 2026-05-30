const fs = require('fs');
const { execSync } = require("child_process");

const d = new Date();
const buildDate = d.toISOString().split('T')[0];
const buildTime = d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' });

const tzLongName = new Intl.DateTimeFormat('en-US', { timeZoneName: 'long' })
  .formatToParts(new Date())
  .find(part => part.type === 'timeZoneName').value;
const tzName = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
  .formatToParts(new Date())
  .find(part => part.type === 'timeZoneName').value;

const t = d.getTime();

// try {
//   const versionRegex = new RegExp("v[\d\.]+\b");
//   const stdout = execSync("npx next --version");
//   const result = versionRegex.exec(stdout.toString());
//   console.log(`Result: ${result}`);
//   nextJsVersion = result ? result[0] : "Unknown";
// } catch (error) {
//   console.error(`Failed to get Next.js version: ${error.message}`);
// }

const output = execSync("yarn info next --name-only").toString().trim();
const versionRegex = new RegExp(":(?<version>(?:\\d+|\\.)+)");
const result = versionRegex.exec(output.toString());
const nextJsVersion = result ? result.groups.version : "Unknown";

const envContent = `
NEXT_PUBLIC_BUILD_DATETIME="${buildDate} ${buildTime}"
NEXT_PUBLIC_BUILD_DATE="${buildDate}"
NEXT_PUBLIC_BUILD_DATE_LOCAL="${d.toLocaleDateString('en-US')}"
NEXT_PUBLIC_BUILD_TIME="${buildTime}"
NEXT_PUBLIC_BUILD_TIME_LOCAL="${d.toLocaleTimeString('en-US', { hour12: true })}"
NEXT_PUBLIC_TZ_LONG="${tzLongName}"
NEXT_PUBLIC_TZ_SHORT="${tzName}"
NEXT_PUBLIC_NODE_VERSION="${process.version}"
NEXT_PUBLIC_NEXTJS_VERSION="${nextJsVersion}"
`;

fs.writeFileSync('.env', envContent.trim());

console.log('Created .env file successfully');
