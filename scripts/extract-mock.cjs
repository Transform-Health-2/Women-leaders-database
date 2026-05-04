const fs = require('fs');
const src = fs.readFileSync(__dirname + '/../client/src/data/mockData.js', 'utf8');
const cleaned = src.replace('export const MOCK_LEADERS = ', 'const MOCK_LEADERS = ') + '; module.exports = MOCK_LEADERS;';
const tmpPath = __dirname + '/_tmp_mock.cjs';
fs.writeFileSync(tmpPath, cleaned);
const data = require(tmpPath);
fs.unlinkSync(tmpPath);
fs.writeFileSync(__dirname + '/seed-data.json', JSON.stringify(data, null, 2));
console.log('Wrote', data.length, 'entries to scripts/seed-data.json');
