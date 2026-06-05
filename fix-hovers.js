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

walkDir(directoryPath, (filePath) => {
  if (filePath.endsWith('.html')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace hover bg with hover outline
    let newContent = content.replace(/hover:bg-slate-50 dark:bg-zinc-800\/50\/50/g, 'hover:outline hover:outline-2 hover:-outline-offset-2 hover:outline-emerald-500 relative hover:z-10');
    // Just in case it's written differently in other files
    newContent = newContent.replace(/hover:bg-slate-50 dark:hover:bg-zinc-800\/50/g, 'hover:outline hover:outline-2 hover:-outline-offset-2 hover:outline-emerald-500 relative hover:z-10');

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Updated hover in ${filePath}`);
    }
  }
});
