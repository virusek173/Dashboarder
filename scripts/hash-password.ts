#!/usr/bin/env node
import crypto from 'node:crypto';

const password = process.argv[2];

if (!password) {
  console.error('Usage: npx tsx scripts/hash-password.ts <password>');
  process.exit(1);
}

// Simple SHA-256 hash (no salt needed for localhost-only dashboard)
const hash = crypto.createHash('sha256').update(password).digest('hex');

console.log('\nGenerated password hash (SHA-256):');
console.log(hash);
console.log('\nAdd this to your .env.local file:');
console.log(`AUTH_PASSWORD_HASH=${hash}`);
