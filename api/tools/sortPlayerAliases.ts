import fs from 'fs';
import path from 'path';

const seedPath = path.resolve(__dirname, '..', 'seeds', 'player_aliases.json');
const seedData = Object.entries(JSON.parse(fs.readFileSync(seedPath).toString()));

seedData.sort((a, b) => (a[0] <= b[0] ? -1 : 1));

fs.writeFileSync(seedPath, JSON.stringify(Object.fromEntries(seedData), null, 4));
