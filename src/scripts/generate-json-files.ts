const files = [
  {
    input: 'src/assets/data/anomalies-v1.yml',
    output: 'src/assets/data/anomalies-v1.json'
  },
  {
    input: 'src/assets/data/anomalies-v2.yml',
    output: 'src/assets/data/anomalies-v2.json'
  }
]
const yaml = require('js-yaml');
const fs = require('fs');

files.forEach(file => {
  const obj = yaml.load(fs.readFileSync(file.input, {encoding: 'utf-8'}));
  fs.writeFileSync(file.output, JSON.stringify(obj, null, 2));
});
