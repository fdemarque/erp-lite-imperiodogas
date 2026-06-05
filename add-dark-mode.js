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
  { regex: /bg-white(?! dark:bg-zinc-900)/g, replace: 'bg-white dark:bg-zinc-900' },
  { regex: /text-slate-800(?! dark:text-zinc-100)/g, replace: 'text-slate-800 dark:text-zinc-100' },
  { regex: /text-slate-700(?! dark:text-zinc-200)/g, replace: 'text-slate-700 dark:text-zinc-200' },
  { regex: /text-slate-600(?! dark:text-zinc-300)/g, replace: 'text-slate-600 dark:text-zinc-300' },
  { regex: /text-slate-500(?! dark:text-zinc-400)/g, replace: 'text-slate-500 dark:text-zinc-400' },
  { regex: /text-slate-400(?! dark:text-zinc-500)/g, replace: 'text-slate-400 dark:text-zinc-500' },
  { regex: /bg-slate-50(?! dark:bg-zinc-800\/50)/g, replace: 'bg-slate-50 dark:bg-zinc-800/50' },
  { regex: /bg-slate-100(?! dark:bg-zinc-800)/g, replace: 'bg-slate-100 dark:bg-zinc-800' },
  { regex: /border-slate-50(?! dark:border-zinc-800\/50)/g, replace: 'border-slate-50 dark:border-zinc-800/50' },
  { regex: /border-slate-100(?! dark:border-zinc-800)/g, replace: 'border-slate-100 dark:border-zinc-800' },
  { regex: /border-slate-200(?! dark:border-zinc-700)/g, replace: 'border-slate-200 dark:border-zinc-700' },
  { regex: /border-slate-300(?! dark:border-zinc-600)/g, replace: 'border-slate-300 dark:border-zinc-600' },
  { regex: /bg-slate-900 text-white hover:bg-slate-800/g, replace: 'bg-emerald-600 text-white hover:bg-emerald-700' },
];

walkDir(directoryPath, (filePath) => {
  if (filePath.endsWith('.html') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    for (const rule of replacements) {
      newContent = newContent.replace(rule.regex, rule.replace);
    }
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Updated ${filePath}`);
    }
  }
});
