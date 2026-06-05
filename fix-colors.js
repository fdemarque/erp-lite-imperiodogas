const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend/src/app');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir(directoryPath, (filePath) => {
  if (filePath.endsWith('.html') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content.replace(/orange-/g, 'emerald-');
    
    // Also rename getOrangeColor
    newContent = newContent.replace(/getOrangeColor/g, 'getEmeraldColor');

    // Update hex colors in getEmeraldColor if they are orange
    if (newContent.includes('getEmeraldColor(value: number): string {')) {
      newContent = newContent.replace(/return '#ea580c';/g, "return '#17311b';"); // emerald-800
      newContent = newContent.replace(/return '#f97316';/g, "return '#214727';"); // emerald-700
      newContent = newContent.replace(/return '#fb923c';/g, "return '#2c5f34';"); // emerald-500
      newContent = newContent.replace(/return '#fdba74';/g, "return '#69a67a';"); // emerald-400
      newContent = newContent.replace(/return '#fed7aa';/g, "return '#94bfa0';"); // emerald-300
    }

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Updated orange to emerald in ${filePath}`);
    }
  }
});
