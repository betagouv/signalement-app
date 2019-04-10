const inputfile = 'src/assets/data/anomalies.yml';
const outputfile = 'src/assets/data/anomalies.json';
const yaml = require('js-yaml');
const fs = require('fs');

const obj = yaml.load(fs.readFileSync(inputfile, {encoding: 'utf-8'}));

fs.writeFileSync(outputfile, JSON.stringify(obj, null, 2));
