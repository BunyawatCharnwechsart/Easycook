const fs = require('fs');

const sharedXml = fs.readFileSync('xlsx_unpacked/xl/sharedStrings.xml', 'utf8');
const shared = [...sharedXml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((match) =>
  [...match[1].matchAll(/<t(?: [^>]*)?>([\s\S]*?)<\/t>/g)]
    .map((text) => text[1])
    .join(''),
);

for (let sheet = 1; sheet <= 2; sheet += 1) {
  const xml = fs.readFileSync(`xlsx_unpacked/xl/worksheets/sheet${sheet}.xml`, 'utf8');
  console.log(`\nSHEET ${sheet}`);
  for (const row of xml.matchAll(/<row[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)) {
    const values = [];
    for (const cell of row[2].matchAll(/<c[^>]*r="([^"]+)"([^>]*)>([\s\S]*?)<\/c>/g)) {
      const raw = (cell[3].match(/<v>([\s\S]*?)<\/v>/) || [])[1] || '';
      values.push(`${cell[1]}=${cell[2].includes('t="s"') ? shared[Number(raw)] : raw}`);
    }
    console.log(`${row[1]}: ${values.join(' | ')}`);
  }
}
