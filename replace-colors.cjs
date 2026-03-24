const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /#5F7161/gi, to: '#4d4c9d' }, // Deep Blue main
  { from: /#4a584b/gi, to: '#3a3977' }, // Deep Blue darker
  { from: /#869D85/gi, to: '#53b2e5' }, // Light Blue
  { from: /#6b7d6a/gi, to: '#4098c7' }, // Light Blue darker
  { from: /#F0F4F1/gi, to: '#f3f3f9' }, // Tint background
];

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;

      for (const rule of replacements) {
        newContent = newContent.replace(rule.from, rule.to);
      }

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

console.log('Starting color replacement...');
processDirectory(path.join(__dirname, 'src'));
console.log('Color replacement complete.');
