#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Import mapping rules
const importMappings = [
  // Components
  { from: /@\/components\/common\//g, to: '@components/common/' },
  { from: /@\/components\/layout\//g, to: '@components/layout/' },
  { from: /@\/components\/dashboard\//g, to: '@components/dashboard/' },
  { from: /@\/components\/filters-and-sorts\//g, to: '@components/filters/' },
  { from: /@\/components\/landing\//g, to: '@components/landing/' },
  { from: /@\/components\/export\//g, to: '@components/common/' }, // ExportButton is in common
  
  // Route-specific components - will be updated to relative imports
  { from: /@\/components\/expenses\//g, to: '@/app/expenses/_components/' },
  { from: /@\/components\/analytics\//g, to: '@/app/analytics/_components/' },
  { from: /@\/components\/settings\//g, to: '@/app/settings/_components/' },
  { from: /@\/components\/auth\//g, to: '@/app/login/_components/' }, // Will need manual review
  
  // Lib
  { from: /@\/lib\//g, to: '@lib/' },
  
  // Hooks
  { from: /@\/hooks\//g, to: '@hooks/' },
  
  // Contexts
  { from: /@\/contexts\//g, to: '@contexts/' },
  
  // Models
  { from: /@\/models\//g, to: '@models/' },
];

function updateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  importMappings.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      updated = true;
    }
  });
  
  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Updated: ${filePath}`);
    return true;
  }
  return false;
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let count = 0;
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      count += processDirectory(fullPath);
    } else if (/\.(js|jsx)$/.test(entry.name)) {
      if (updateImports(fullPath)) {
        count++;
      }
    }
  });
  
  return count;
}

// Process src directory
console.log('🔄 Updating imports...\n');
const srcDir = path.join(__dirname, '..', 'src');
const filesUpdated = processDirectory(srcDir);

console.log(`\n✅ Updated ${filesUpdated} files`);
console.log('\n⚠️  Manual review needed for:');
console.log('   - Auth components (LoginForm, RegisterForm) - verify correct paths');
console.log('   - Relative imports within route components');
console.log('   - ErrorBoundary component references');
