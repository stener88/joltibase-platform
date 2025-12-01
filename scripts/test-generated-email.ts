/**
 * Test validator on generated email
 */

import fs from 'fs';
import path from 'path';
import { validateEmail, getValidationSummary } from '../emails/lib/email-validator';

const filepath = path.join(process.cwd(), 'emails/generated/Email_1764540847376_92hxpt.tsx');

if (!fs.existsSync(filepath)) {
  console.log('❌ File not found');
  process.exit(1);
}

const code = fs.readFileSync(filepath, 'utf-8');
const result = validateEmail(code);
const summary = getValidationSummary(result);

console.log(`📄 Generated Newsletter Email`);
console.log(`   ${summary}`);

if (result.issues.length > 0) {
  console.log(`\n   Issues:`);
  result.issues.forEach((issue, i) => {
    const emoji = issue.severity === 'error' ? '❌' : '⚠️';
    console.log(`   ${i + 1}. ${emoji} [${issue.type}] ${issue.message}`);
  });
} else {
  console.log('\n✅ No issues found!');
}

