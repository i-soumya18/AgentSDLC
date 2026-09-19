import { executeVerification } from '../verification/verify-runner.js';

export async function runVerify(args = []) {
  const featureId = args[0];
  const result = await executeVerification({ featureId });
  if (!result.success) {
    process.exitCode = 1;
  }
}
