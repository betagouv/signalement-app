const path = require('path');
const yaml = require('js-yaml');
const yamlImport = require('yaml-import');
const fs = require('fs');
const files = [
  {
    input: 'anomalies.yml',
    output: 'anomalies.json'
  }
];

const root = path.join(__dirname, '..', 'assets/data')
files.forEach(file => {
  const tmpFile = path.join(root, 'tmp.yml');
  yamlImport.write(path.join(root, file.input), tmpFile);
  const obj = yaml.load(fs.readFileSync(tmpFile, {encoding: 'utf-8'}));
  fs.writeFileSync(path.join(root, file.output), JSON.stringify(obj, null, 2));
  fs.unlinkSync(tmpFile);
});
