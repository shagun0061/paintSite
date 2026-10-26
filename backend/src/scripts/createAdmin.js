/**
 * Creates (or resets the password of) an admin user.
 *
 *   npm run create-admin -- --email owner@yourbusiness.com --name "Owner Name" [--role admin|editor]
 *
 * The password is prompted for (input hidden) or read from ADMIN_PASSWORD.
 */
import readline from 'node:readline';
import { parseArgs } from 'node:util';
import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { AdminUser } from '../models/AdminUser.js';
import { createAdminSchema } from '../validators/index.js';

function promptHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => rl.output.write(s.includes(question) ? s : '');
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
  });
}

const { values } = parseArgs({
  options: { email: { type: 'string' }, name: { type: 'string' }, role: { type: 'string', default: 'admin' } },
});

if (!values.email) {
  console.error('Usage: npm run create-admin -- --email you@example.com --name "Your Name" [--role admin|editor]');
  process.exit(1);
}
if (env.MONGODB_URI === 'memory') {
  console.error('MONGODB_URI=memory: set ADMIN_EMAIL / ADMIN_PASSWORD in .env instead; the admin is created on start.');
  process.exit(1);
}

const password = env.ADMIN_PASSWORD || (await promptHidden('Password (min 10 chars, letters + numbers): '));
const parsed = createAdminSchema.safeParse({ name: values.name || 'Site Owner', email: values.email, password, role: values.role });
if (!parsed.success) {
  for (const issue of parsed.error.issues) console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  process.exit(1);
}

try {
  await connectDB(env.MONGODB_URI);
  const { name, email, role } = parsed.data;
  const passwordHash = await AdminUser.hashPassword(parsed.data.password);
  const existing = await AdminUser.findOne({ email });
  if (existing) {
    existing.set({ passwordHash, role, tokenVersion: existing.tokenVersion + 1, lockUntil: undefined });
    await existing.save();
    console.log(`Updated password and role for ${email}.`);
  } else {
    await AdminUser.create({ name, email, role, passwordHash });
    console.log(`Created ${role} account for ${email}.`);
  }
} catch (err) {
  console.error('Failed:', err.message);
  process.exitCode = 1;
} finally {
  await disconnectDB();
}
