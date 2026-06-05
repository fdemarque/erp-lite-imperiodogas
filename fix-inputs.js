const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend/src/app/pages');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const replacements = [
  { regex: /<select([^>]+)class="([^"]*)"([^>]*)>/g, replace: (match, p1, classes, p3) => {
    if (!classes.includes('dark:text-white')) classes += ' dark:text-white';
    if (!classes.includes('dark:bg-zinc-900')) classes += ' dark:bg-zinc-900';
    return `<select${p1}class="${classes}"${p3}>`;
  }},
  { regex: /<input([^>]+)class="([^"]*)"([^>]*)>/g, replace: (match, p1, classes, p3) => {
    if (match.includes('type="checkbox"')) return match;
    if (!classes.includes('dark:text-white')) classes += ' dark:text-white';
    if (!classes.includes('dark:bg-zinc-900')) classes += ' dark:bg-zinc-900';
    return `<input${p1}class="${classes}"${p3}>`;
  }}
];

walkDir(directoryPath, (filePath) => {
  if (filePath.endsWith('.html')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    for (const rule of replacements) {
      newContent = newContent.replace(rule.regex, rule.replace);
    }
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Updated form fields in ${filePath}`);
    }
  }
});
