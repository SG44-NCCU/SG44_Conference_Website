const fs = require('fs');
const path = require('path');

const replacements = [
  // Aesthetic border and layout refinements
  { from: /\brounded-lg\b/g, to: 'rounded-sm' },
  { from: /\brounded-xl\b/g, to: 'rounded-md' },
  { from: /\bshadow-lg\b/g, to: 'shadow-sm' },
  { from: /\bshadow-xl\b/g, to: 'shadow-md border border-stone-200' },
  { from: /\bfont-bold\b/g, to: 'font-semibold tracking-wide' },
  
  // Missed green status colors -> Tailwind Indigo matching the deep blue/purple brand
  { from: /\bbg-green-50\b/g, to: 'bg-[#f3f3f9]' },
  { from: /\bbg-green-100\b/g, to: 'bg-indigo-100' },
  { from: /\btext-green-700\b/g, to: 'text-[#4d4c9d]' },
  { from: /\bordered-green-200\b/g, to: 'border-indigo-200' },
  { from: /\btext-green-800\b/g, to: 'text-[#3a3977]' },
  { from: /\border-green-100\b/g, to: 'border-indigo-100' },
];

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;

      for (const rule of replacements) {
        newContent = newContent.replace(rule.from, rule.to);
      }

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Refined aesthetics: ${fullPath}`);
      }
    }
  }
}

console.log('Starting layout and color refinement...');
processDirectory(path.join(__dirname, 'src'));
console.log('Refinement complete.');
