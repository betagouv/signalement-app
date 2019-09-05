#! /usr/bin/env node

const util = require('util');
const path = require('path');
const fs = require('fs');
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

const outputfile = "src/assets/data/blog-meta-data.json"

async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = path.resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.reduce((a, f) => a.concat(f), []);
}

const root = path.join(__dirname, "..", "assets/blog")

async function res() {
    let files = await getFiles(root)
    files = files.filter(f => f.endsWith(".md"))
        .map(f => {
            const PATTERN = "/src/assets/"
            return f.slice(f.indexOf(PATTERN) + PATTERN.length - 1)
        })
        .map(f => {
            return f.slice(0, f.lastIndexOf("/"))
        })
        .sort((a, b) => b.localeCompare(a))

    fs.writeFileSync(outputfile, JSON.stringify(files, null, 2));

}

res().catch(err => console.error("Error on script", err))
