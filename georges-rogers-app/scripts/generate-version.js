const fs = require('fs');
const path = require('path');

const name = `${require('../package.json').name}`;
const version = `${require('../package.json').version}`;
const buildDate = new Date().toISOString();
const versionFile = `// Auto-generated file
export const BUILD_NAME = '${name}';
export const BUILD_VERSION = '${version.replace('.0.0', '')}';
export const BUILD_DATE = '${buildDate}';
export const BUILD_INFO = '@(#)${name} build ${version.replace('.0.0', '')}';
`;

fs.writeFileSync(
  path.join(__dirname, '../src/app/version.ts'),
  versionFile
);

console.log(`Version file generated: ${version}`);