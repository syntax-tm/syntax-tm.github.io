const fs = require('fs');

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

const envContent = `
NEXT_PUBLIC_BUILD_DATETIME="${buildDate} ${buildTime}"
NEXT_PUBLIC_BUILD_DATE="${buildDate}"
NEXT_PUBLIC_BUILD_DATE_LOCAL="${d.toLocaleDateString('en-US')}"
NEXT_PUBLIC_BUILD_TIME="${buildTime}"
NEXT_PUBLIC_BUILD_TIME_LOCAL="${d.toLocaleTimeString('en-US', { hour12: true })}"
NEXT_PUBLIC_TZ_LONG="${tzLongName}"
NEXT_PUBLIC_TZ_SHORT="${tzName}"
NEXT_PUBLIC_NODE_VERSION=${process.version}
`;

fs.writeFileSync('.env', envContent.trim());

console.log('Created .env file successfully');
