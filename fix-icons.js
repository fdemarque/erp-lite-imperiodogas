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
  // Change header icons from emerald back to orange
  { regex: /class="w-6 h-6 text-emerald-500"/g, replace: 'class="w-6 h-6 text-orange-500"' },
  { regex: /class="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0"/g, replace: 'class="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0"' },
  
  // Fix loading spinner from orange to primary/emerald
  { regex: /border-orange-200 border-t-orange-500 rounded-full animate-spin/g, replace: 'border-emerald-200 border-t-emerald-500 rounded-full animate-spin' },
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
      console.log(`Updated icons in ${filePath}`);
    }
  }
});
