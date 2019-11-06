const files = [
  {
    input: 'src/assets/data/anomalies.yml',
    output: 'src/assets/data/anomalies.json'
  }
]
const yaml = require('js-yaml');
const fs = require('fs');

files.forEach(file => {
  const obj = yaml.load(fs.readFileSync(file.input, {encoding: 'utf-8'}));
  fs.writeFileSync(file.output, JSON.stringify(obj, null, 2));
});
