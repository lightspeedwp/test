# Coverage Gap Analysis Tools & Scripts

## Tool 1: Coverage Delta Calculator Script

### Purpose
Compares two coverage JSON reports and identifies files with regression.

### Usage
```bash
node analyze-coverage-delta.js coverage-before.json coverage-after.json
```

### Script Code
```javascript
// analyze-coverage-delta.js
const fs = require('fs');
const path = require('path');

function analyzeCoverageDelta(beforeFile, afterFile) {
  const before = JSON.parse(fs.readFileSync(beforeFile, 'utf-8'));
  const after = JSON.parse(fs.readFileSync(afterFile, 'utf-8'));

  const results = {
    overall: {},
    files: [],
    critical: [],
    high: [],
    medium: [],
    low: []
  };

  // Calculate overall delta
  const linesDelta = after.total.lines.pct - before.total.lines.pct;
  const funcsDelta = after.total.functions.pct - before.total.functions.pct;
  const branchDelta = after.total.branches.pct - before.total.branches.pct;
  const stmtDelta = after.total.statements.pct - before.total.statements.pct;

  results.overall = {
    linesDelta,
    functionsDelta: funcsDelta,
    branchesDelta: branchDelta,
    statementsDelta: stmtDelta,
    totalRegression: (linesDelta + funcsDelta + branchDelta + stmtDelta) / 4
  };

  // Analyze per-file deltas
  Object.keys(after.files).forEach(filePath => {
    if (!before.files[filePath]) {
      // New file - check if it has coverage
      const afterFile = after.files[filePath];
      results.files.push({
        file: filePath,
        type: 'NEW',
        linesDelta: 0,
        linesAfter: `${afterFile.lines.covered}/${afterFile.lines.total}`,
        linesPct: afterFile.lines.pct
      });
      return;
    }

    const beforeFile = before.files[filePath];
    const afterFileData = after.files[filePath];

    const linesDelta = afterFileData.lines.pct - beforeFile.lines.pct;
    const functionsDelta = afterFileData.functions.pct - beforeFile.functions.pct;
    const branchesDelta = afterFileData.branches.pct - beforeFile.branches.pct;

    // Only report files with regression
    if (linesDelta < 0 || functionsDelta < 0) {
      const fileEntry = {
        file: filePath,
        linesDelta,
        linesAfter: `${afterFileData.lines.covered}/${afterFileData.lines.total}`,
        linesPctAfter: afterFileData.lines.pct,
        functionsDelta,
        functionsPctAfter: afterFileData.functions.pct,
        branchesDelta,
        branchesPctAfter: afterFileData.branches.pct,
        priority: calculatePriority(linesDelta, afterFileData.lines.total)
      };

      results.files.push(fileEntry);

      // Categorize by priority
      if (linesDelta < -20 || (linesDelta < -15 && afterFileData.lines.total > 20)) {
        results.critical.push(fileEntry);
      } else if (linesDelta < -15) {
        results.high.push(fileEntry);
      } else if (linesDelta < -5) {
        results.medium.push(fileEntry);
      } else {
        results.low.push(fileEntry);
      }
    }
  });

  // Sort by delta
  results.files.sort((a, b) => a.linesDelta - b.linesDelta);

  return results;
}

function calculatePriority(linesDelta, totalLines) {
  const regressionPct = Math.abs(linesDelta);
  const impactedLines = Math.round(totalLines * (regressionPct / 100));

  if (regressionPct > 20) return 'CRITICAL';
  if (regressionPct > 15) return 'HIGH';
  if (regressionPct > 5) return 'MEDIUM';
  return 'LOW';
}

function printReport(results) {
  console.log('\n════════════════════════════════════════════');
  console.log('  JEST COVERAGE GAP ANALYSIS REPORT');
  console.log('════════════════════════════════════════════\n');

  console.log('OVERALL METRICS:');
  console.log(`  Lines:       ${results.overall.linesDelta.toFixed(2)}%`);
  console.log(`  Functions:   ${results.overall.functionsDelta.toFixed(2)}%`);
  console.log(`  Branches:    ${results.overall.branchesDelta.toFixed(2)}%`);
  console.log(`  Statements:  ${results.overall.statementsDelta.toFixed(2)}%`);
  console.log(`  Average:     ${results.overall.totalRegression.toFixed(2)}%\n`);

  if (results.critical.length > 0) {
    console.log('🔴 CRITICAL (>20% regression):');
    results.critical.forEach(f => {
      console.log(`  ${f.file}`);
      console.log(`    Lines: ${f.linesPctAfter.toFixed(1)}% (${f.linesAfter}) [${f.linesDelta.toFixed(1)}%]`);
      console.log(`    Functions: ${f.functionsPctAfter.toFixed(1)}% [${f.functionsDelta.toFixed(1)}%]`);
      console.log(`    Branches: ${f.branchesPctAfter.toFixed(1)}% [${f.branchesDelta.toFixed(1)}%]\n`);
    });
  }

  if (results.high.length > 0) {
    console.log('🟠 HIGH (15-20% regression):');
    results.high.forEach(f => {
      console.log(`  ${f.file}: ${f.linesPctAfter.toFixed(1)}% [${f.linesDelta.toFixed(1)}%]`);
    });
    console.log();
  }

  if (results.medium.length > 0) {
    console.log(`🟡 MEDIUM (5-15% regression): ${results.medium.length} files`);
  }

  if (results.low.length > 0) {
    console.log(`🟢 LOW (<5% regression): ${results.low.length} files\n`);
  }

  console.log(`Total files with regression: ${results.files.length}`);
  console.log('════════════════════════════════════════════\n');
}

// Main
const [, , beforeFile, afterFile] = process.argv;
if (!beforeFile || !afterFile) {
  console.error('Usage: node analyze-coverage-delta.js <before.json> <after.json>');
  process.exit(1);
}

const results = analyzeCoverageDelta(beforeFile, afterFile);
printReport(results);

// Save detailed report
fs.writeFileSync('coverage-delta-report.json', JSON.stringify(results, null, 2));
console.log('Detailed report saved to coverage-delta-report.json');
```

## Tool 2: Coverage Visualization Script

### Purpose
Generates an interactive HTML report showing coverage regression visually.

### Output
Interactive HTML with:
- Files sorted by regression percentage
- Color-coded severity (red/orange/yellow/green)
- Drill-down into function-level gaps
- Branch coverage analysis

### Script Code
```javascript
// generate-coverage-html.js
const fs = require('fs');

function generateCoverageHtml(deltaReport) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Jest Coverage Gap Analysis</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 { color: #333; border-bottom: 3px solid #007bff; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 30px; }
    .metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin: 20px 0;
    }
    .metric-card {
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }
    .metric-value {
      font-size: 28px;
      font-weight: bold;
      margin: 10px 0;
    }
    .metric-label { color: #666; font-size: 12px; }
    .positive { color: #28a745; }
    .negative { color: #dc3545; }
    
    .file-list {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .file-item {
      padding: 15px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .file-item:hover { background: #f9f9f9; }
    .file-name { flex: 1; font-weight: 500; }
    .file-severity {
      padding: 4px 12px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 12px;
      margin: 0 10px;
    }
    .critical { background: #dc3545; color: white; }
    .high { background: #fd7e14; color: white; }
    .medium { background: #ffc107; color: black; }
    .low { background: #28a745; color: white; }
    
    .progress-bar {
      width: 200px;
      height: 8px;
      background: #eee;
      border-radius: 4px;
      overflow: hidden;
      display: inline-block;
    }
    .progress-fill {
      height: 100%;
      background: #007bff;
      transition: width 0.3s;
    }
    
    .stats {
      display: flex;
      gap: 20px;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <h1>Jest Coverage Gap Analysis</h1>
  <p>Analysis of coverage regression from refactoring</p>
  
  <div class="metrics">
    <div class="metric-card">
      <div class="metric-label">Lines Coverage</div>
      <div class="metric-value negative">${deltaReport.overall.linesDelta.toFixed(2)}%</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Functions Coverage</div>
      <div class="metric-value negative">${deltaReport.overall.functionsDelta.toFixed(2)}%</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Branches Coverage</div>
      <div class="metric-value negative">${deltaReport.overall.branchesDelta.toFixed(2)}%</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Avg Regression</div>
      <div class="metric-value negative">${deltaReport.overall.totalRegression.toFixed(2)}%</div>
    </div>
  </div>
  
  <h2>Files with Coverage Regression</h2>
  <div class="file-list">
    ${deltaReport.critical.concat(deltaReport.high, deltaReport.medium, deltaReport.low)
      .map(file => `
        <div class="file-item">
          <div class="file-name">${file.file}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${file.linesPctAfter}%"></div>
          </div>
          <div class="stats">
            <span>${file.linesPctAfter.toFixed(1)}% (${file.linesAfter})</span>
            <span>${file.linesDelta.toFixed(1)}% delta</span>
          </div>
          <div class="file-severity ${file.priority.toLowerCase()}">${file.priority}</div>
        </div>
      `).join('')}
  </div>
</body>
</html>`;

  fs.writeFileSync('coverage-analysis.html', html);
  console.log('HTML report generated: coverage-analysis.html');
}

const report = JSON.parse(fs.readFileSync('coverage-delta-report.json', 'utf-8'));
generateCoverageHtml(report);
```

## Tool 3: Uncovered Functions Extractor

### Purpose
Extracts list of uncovered functions from coverage report using source code inspection.

### Usage
```bash
node extract-uncovered-functions.js src/validators coverage/coverage-final.json
```

### Script Code
```javascript
// extract-uncovered-functions.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function extractFunctions(srcDir, coverageFile) {
  const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf-8'));
  const uncovered = [];

  Object.keys(coverage.files).forEach(filePath => {
    const fileCov = coverage.files[filePath];
    
    // Skip if all functions are covered
    if (fileCov.functions.pct === 100) return;

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');

    // Extract function names and their line ranges
    const functions = extractFunctionDefinitions(fileContent);
    
    functions.forEach(func => {
      const lineNum = func.line;
      const lineCov = fileCov.lineMap?.[lineNum];
      
      // If line not covered, function is uncovered
      if (lineCov && lineCov.count === 0) {
        uncovered.push({
          file: filePath,
          name: func.name,
          line: lineNum,
          type: func.type,
          complexity: estimateComplexity(func.body)
        });
      }
    });
  });

  return uncovered;
}

function extractFunctionDefinitions(code) {
  const functions = [];
  
  // Match function declarations
  const fnRegex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)|(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/gm;
  
  let match;
  while ((match = fnRegex.exec(code)) !== null) {
    functions.push({
      name: match[1] || match[3],
      line: code.substring(0, match.index).split('\n').length,
      type: match[1] ? 'function' : 'arrow',
      body: extractFunctionBody(code, match.index)
    });
  }

  return functions;
}

function extractFunctionBody(code, startIdx) {
  let braceCount = 0;
  let inBody = false;
  let body = '';

  for (let i = startIdx; i < code.length; i++) {
    const char = code[i];
    
    if (char === '{') {
      inBody = true;
      braceCount++;
    } else if (char === '}') {
      braceCount--;
      if (braceCount === 0 && inBody) break;
    }
    
    if (inBody) body += char;
  }

  return body;
}

function estimateComplexity(body) {
  const ifCount = (body.match(/\bif\b/g) || []).length;
  const switchCount = (body.match(/\bswitch\b/g) || []).length;
  const loopCount = (body.match(/\b(for|while)\b/g) || []).length;
  const ternaryCount = (body.match(/\?/g) || []).length;

  const complexity = 1 + ifCount + switchCount + loopCount + ternaryCount;
  
  if (complexity > 10) return 'HIGH';
  if (complexity > 5) return 'MEDIUM';
  return 'LOW';
}

// Main
const [, , srcDir, coverageFile] = process.argv;
const uncovered = extractFunctions(srcDir, coverageFile);

console.log('\n=== UNCOVERED FUNCTIONS ===\n');
uncovered.sort((a, b) => b.complexity.localeCompare(a.complexity));

uncovered.forEach(fn => {
  console.log(`${fn.file}:${fn.line}`);
  console.log(`  Function: ${fn.name} (${fn.type})`);
  console.log(`  Complexity: ${fn.complexity}\n`);
});

// Save to file
fs.writeFileSync('uncovered-functions.json', JSON.stringify(uncovered, null, 2));
console.log(`\nTotal uncovered functions: ${uncovered.length}`);
console.log('Detailed list saved to uncovered-functions.json');
```

## Tool 4: Quick Coverage Check Script

### Add to package.json
```json
{
  "scripts": {
    "test:coverage": "jest --coverage --watchAll=false",
    "test:coverage-check": "jest --coverage --watchAll=false && node check-coverage.js",
    "analyze-coverage": "node analyze-coverage-delta.js coverage/coverage-before.json coverage/coverage-final.json"
  }
}
```

## Tool 5: Coverage Threshold Validator

### Purpose
Enforces coverage thresholds and provides detailed output when thresholds are violated.

### Script Code
```javascript
// check-coverage.js
const fs = require('fs');

function checkCoverageThresholds() {
  const summary = JSON.parse(
    fs.readFileSync('coverage/coverage-summary.json', 'utf-8')
  );

  const thresholds = {
    global: { lines: 85, functions: 85, branches: 80, statements: 85 },
    validators: { lines: 100, functions: 100, branches: 100, statements: 100 }
  };

  let passed = true;

  console.log('\n📊 COVERAGE THRESHOLD CHECK\n');

  // Check global threshold
  Object.keys(['lines', 'functions', 'branches', 'statements']).forEach(metric => {
    const actual = summary.total[metric].pct;
    const required = thresholds.global[metric];

    const status = actual >= required ? '✓' : '✗';
    console.log(`${status} Global ${metric}: ${actual.toFixed(1)}% (required: ${required}%)`);

    if (actual < required) passed = false;
  });

  if (!passed) {
    console.error('\n❌ Coverage thresholds not met!');
    process.exit(1);
  }

  console.log('\n✅ All coverage thresholds met!\n');
}

checkCoverageThresholds();
```

## Integration Checklist

- [ ] Add scripts to package.json
- [ ] Run baseline coverage: `npm run test:coverage`
- [ ] Commit coverage-before.json to git
- [ ] Make refactoring changes
- [ ] Run coverage again: `npm run test:coverage`
- [ ] Run delta analysis: `npm run analyze-coverage`
- [ ] Review HTML report: `open coverage-analysis.html`
- [ ] Extract uncovered functions: `node extract-uncovered-functions.js`
- [ ] Prioritize test cases based on output
- [ ] Implement high-priority tests first
