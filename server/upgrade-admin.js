import connectDB from './src/config/db.js';
import User from './src/models/User.js';
import 'dotenv/config';

async function run() {
  await connectDB();
  const res = await User.updateMany({ role: 'admin' }, { role: 'super_admin' });
  console.log('Updated users:', res);
  process.exit(0);
}
run();
