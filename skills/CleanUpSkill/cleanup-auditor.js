const fs = require('fs');
const path = require('path');

// ANSI escape codes for beautiful colorized terminal output
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m'
};

// Main Execution
function main() {
  const args = process.argv.slice(2);
  let mode = 'all';

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    return;
  }

  const onlyIndex = args.indexOf('--only');
  if (onlyIndex !== -1 && args[onlyIndex + 1]) {
    mode = args[onlyIndex + 1].toLowerCase();
  }

  console.log(`\n${COLORS.bright}${COLORS.cyan}--- BASESAAS CLEANUP & CODE AUDITOR ---${COLORS.reset}\n`);

  const projectRoot = path.resolve(__dirname, '../..');
  const srcAppDir = path.join(projectRoot, 'src/app');
  const i18nFilePath = path.join(projectRoot, 'public/i18n/pt.json');

  if (!fs.existsSync(srcAppDir)) {
    console.error(`${COLORS.red}Error: 'src/app' directory not found at ${srcAppDir}${COLORS.reset}`);
    process.exit(1);
  }

  let totalWarnings = 0;

  if (mode === 'all' || mode === 'css') {
    totalWarnings += auditCSS(srcAppDir);
  }

  if (mode === 'all' || mode === 'i18n') {
    totalWarnings += auditI18n(srcAppDir, i18nFilePath);
  }

  if (mode === 'all' || mode === 'specs') {
    totalWarnings += auditSpecs(srcAppDir);
  }

  console.log(`\n${COLORS.bright}${COLORS.cyan}---------------------------------------${COLORS.reset}`);
  if (totalWarnings === 0) {
    console.log(`${COLORS.bgGreen}${COLORS.bright}  SUCCESS  ${COLORS.reset} ${COLORS.green}No unused assets or shallow unit tests found! Codebase is perfectly clean!${COLORS.reset}\n`);
  } else {
    console.log(`${COLORS.bgRed}${COLORS.bright}  AUDIT WARNINGS  ${COLORS.reset} ${COLORS.yellow}Found ${totalWarnings} warnings that can be cleaned up or improved.${COLORS.reset}\n`);
  }
}

// 1. CSS Auditor
function auditCSS(srcAppDir) {
  console.log(`${COLORS.bright}${COLORS.blue}🎨 AUDITING CSS CLASSES...${COLORS.reset}`);
  const cssFiles = getFilesRecursively(srcAppDir, ['.css']);
  let unusedCount = 0;

  cssFiles.forEach(cssPath => {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const classes = extractCssClasses(cssContent);
    if (classes.length === 0) return;

    // Locate matching HTML or TS component in the same folder
    const dir = path.dirname(cssPath);
    const baseName = path.basename(cssPath, '.component.css');
    
    // Look for both standard and specific html files in the directory
    const filesInDir = fs.readdirSync(dir);
    const componentHtml = filesInDir.find(f => f.endsWith('.html'));
    const componentTs = filesInDir.find(f => f.endsWith('.ts') && !f.endsWith('.spec.ts'));

    let combinedContent = '';
    if (componentHtml) {
      combinedContent += fs.readFileSync(path.join(dir, componentHtml), 'utf8');
    }
    if (componentTs) {
      combinedContent += fs.readFileSync(path.join(dir, componentTs), 'utf8');
    }

    const unusedInFile = [];
    classes.forEach(cls => {
      // Check if class is used in templates or class attributes
      const isUsed = combinedContent.includes(cls);
      if (!isUsed) {
        unusedInFile.push(cls);
      }
    });

    if (unusedInFile.length > 0) {
      const relativePath = path.relative(srcAppDir, cssPath);
      console.log(`  ${COLORS.yellow}⚠${COLORS.reset} ${COLORS.bright}${relativePath}${COLORS.reset}:`);
      unusedInFile.forEach(cls => {
        console.log(`    - Unused CSS Class: ${COLORS.red}.${cls}${COLORS.reset}`);
        unusedCount++;
      });
    }
  });

  if (unusedCount === 0) {
    console.log(`  ${COLORS.green}✔ All CSS classes are actively used in their templates!${COLORS.reset}\n`);
  } else {
    console.log(`  ${COLORS.red}✗ Found ${unusedCount} unused CSS classes in component stylesheets.${COLORS.reset}\n`);
  }
  return unusedCount;
}

// 2. i18n Translation Keys Auditor
function auditI18n(srcAppDir, i18nFilePath) {
  console.log(`${COLORS.bright}${COLORS.blue}🌍 AUDITING INTERNATIONALIZATION KEYS...${COLORS.reset}`);
  if (!fs.existsSync(i18nFilePath)) {
    console.log(`  ${COLORS.yellow}⚠ i18n default translation file not found at ${i18nFilePath}. Skipping i18n audit.${COLORS.reset}\n`);
    return 0;
  }

  const i18nContent = JSON.parse(fs.readFileSync(i18nFilePath, 'utf8'));
  const flatKeys = Object.keys(flattenJson(i18nContent));
  const codeFiles = getFilesRecursively(srcAppDir, ['.html', '.ts']);
  
  // Read all code contents once to make the search extremely fast
  const allCodeContents = codeFiles
    .filter(f => !f.endsWith('.spec.ts'))
    .map(f => fs.readFileSync(f, 'utf8'))
    .join('\n');

  let unusedCount = 0;
  const unusedKeys = [];

  flatKeys.forEach(key => {
    // Check if key is used inside transloco calls, pipes or TS injection
    const isUsed = allCodeContents.includes(key);
    if (!isUsed) {
      unusedKeys.push(key);
      unusedCount++;
    }
  });

  if (unusedKeys.length > 0) {
    console.log(`  ${COLORS.yellow}⚠ Found ${unusedCount} unused/orphan translation keys in pt.json:${COLORS.reset}`);
    unusedKeys.forEach(key => {
      console.log(`    - Unused Key: ${COLORS.red}"${key}"${COLORS.reset}`);
    });
    console.log('');
  } else {
    console.log(`  ${COLORS.green}✔ All translation keys in pt.json are actively used across the application!${COLORS.reset}\n`);
  }

  return unusedCount;
}

// 3. Unit Test Specs Auditor
function auditSpecs(srcAppDir) {
  console.log(`${COLORS.bright}${COLORS.blue}🧪 AUDITING UNIT TEST SPECS QUALITY...${COLORS.reset}`);
  const specFiles = getFilesRecursively(srcAppDir, ['.spec.ts']);
  let dummyCount = 0;

  specFiles.forEach(specPath => {
    const specContent = fs.readFileSync(specPath, 'utf8');
    
    // Simple count of it() blocks and checks
    const itMatches = specContent.match(/it\s*\(/g) || [];
    const hasCreateTest = specContent.includes('should create') || specContent.includes('toBeTruthy()');
    
    // If it only has one test and it's just 'should create', it's a shallow/dummy test
    if (itMatches.length <= 1 && hasCreateTest) {
      const relativePath = path.relative(srcAppDir, specPath);
      console.log(`  ${COLORS.yellow}⚠ Shallow Spec:${COLORS.reset} ${COLORS.bright}${relativePath}${COLORS.reset}`);
      console.log(`    - Only verifies instantiation (${COLORS.yellow}toBeTruthy()${COLORS.reset}). Needs real business logic tests.`);
      dummyCount++;
    }
  });

  if (dummyCount === 0) {
    console.log(`  ${COLORS.green}✔ All test specs are rich and test custom component interactions!${COLORS.reset}\n`);
  } else {
    console.log(`  ${COLORS.yellow}✗ Found ${dummyCount} specs containing only baseline instantiation tests (shallow tests).${COLORS.reset}\n`);
  }

  return dummyCount;
}

// --- Helper Functions ---

function getFilesRecursively(dir, extensions = []) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath, extensions));
    } else {
      const ext = path.extname(file);
      if (extensions.length === 0 || extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  return results;
}

function extractCssClasses(cssContent) {
  const classes = new Set();
  // Remove multi-line and single line comments
  const cleanContent = cssContent.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  // Matches .classname but ignores pseudo-elements, parameters, attributes etc.
  const regex = /\.([a-zA-Z0-9_-]+)(?=\s|\{|,|\.|:|::|\[|\))/g;
  let match;
  while ((match = regex.exec(cleanContent)) !== null) {
    const className = match[1];
    // Exclude animation names, variables or pure number classes
    if (!/^[0-9]/.test(className)) {
      classes.add(className);
    }
  }
  return Array.from(classes);
}

function flattenJson(obj, prefix = '') {
  let paths = {};
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(paths, flattenJson(obj[key], prefix ? `${prefix}.${key}` : key));
    } else {
      paths[prefix ? `${prefix}.${key}` : key] = obj[key];
    }
  }
  return paths;
}

function printHelp() {
  console.log(`
Usage:
  node skills/CleanUpSkill/cleanup-auditor.js [options]

Options:
  -h, --help      Show this help message
  --only <mode>   Run a specific audit mode:
                  - 'css'   : Audits component stylesheets for unused CSS classes
                  - 'i18n'  : Audits default translation files for orphan keys
                  - 'specs' : Audits unit test spec files for shallow/dummy tests
  `);
}

main();
