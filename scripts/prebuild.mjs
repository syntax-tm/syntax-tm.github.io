import { writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import process from 'node:process';
import * as os from 'node:os';

const d = new Date();

const buildDate = d.toISOString().split('T')[0];
const buildTime = d.toLocaleTimeString('en-US', {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'short',
});

const tzLongName = new Intl.DateTimeFormat('en-US', { timeZoneName: 'long' })
  .formatToParts(d)
  .find(part => part.type === 'timeZoneName')?.value ?? 'Unknown';

const tzName = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
  .formatToParts(d)
  .find(part => part.type === 'timeZoneName')?.value ?? 'Unknown';

// const shell = os.platform() === 'win32';
// const { stdout = '' } = spawnSync('yarn', ['info', 'next', '--name-only'], {
//   shell,
//   encoding: 'utf8',
// });

const { stdout = '' } = spawnSync('npx', ['next -v'], {
  encoding: 'utf8',
});

const versionRegex = /\s+(?<version>[v\d\.]+)/i;
const match = versionRegex.exec(stdout);
const nextJsVersion = match?.groups?.version ?? 'Unknown';

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
NEXT_PUBLIC_NEXTJS_VERSION_PROCESS="${process.nextJsVersion ?? 'Unknown'}"
`;

console.log('.env file contents:');
console.log(envContent);

writeFileSync('.env', envContent.trim());

console.log('Created .env file successfully');