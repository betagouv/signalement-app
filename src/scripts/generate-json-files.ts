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

const addUniqueId = (prefix = '', obj, depth = 0) => {
  let index = 1;
  obj.forEach(entry => {
    const id = prefix + (depth === 1 ? '-' : '.') + (entry.rank || index++);
    entry.id = id;
    if (entry.subcategories) {
      addUniqueId(id, entry.subcategories, depth + 1);
    }
  });
};

const root = path.join(__dirname, '..', 'assets/data');
files.forEach(file => {
  const tmpFile = path.join(root, 'tmp.yml');
  yamlImport.write(path.join(root, file.input), tmpFile);
  const obj = yaml.load(fs.readFileSync(tmpFile, { encoding: 'utf-8' }));
  const version = '1';
  obj.version = version;
  addUniqueId(version, obj.list);
  fs.writeFileSync(path.join(root, file.output), JSON.stringify(obj, null, 2));
  fs.unlinkSync(tmpFile);
});
