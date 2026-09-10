import fs from 'node:fs/promises';
import path from 'node:path';

export async function runDrift(args) {
  const featureId = args[0] || '001-feature';
  const projectRoot = process.cwd();
  const featureDir = path.join(projectRoot, 'specs', featureId);

  console.log(`\x1b[33m🔍 [CONVERGENCE & DRIFT DETECTOR]\x1b[0m Checking: \x1b[1m${featureId}\x1b[0m\n`);

  let specContent = '';
  let tasksContent = '';
  let verificationContent = '';

  try {
    specContent = await fs.readFile(path.join(featureDir, 'spec.md'), 'utf8');
  } catch {
    console.log(`\x1b[33mWarning: specs/${featureId}/spec.md not found.\x1b[0m`);
  }

  try {
    tasksContent = await fs.readFile(path.join(featureDir, 'tasks.md'), 'utf8');
  } catch {
    console.log(`\x1b[33mWarning: specs/${featureId}/tasks.md not found.\x1b[0m`);
  }

  try {
    verificationContent = await fs.readFile(path.join(featureDir, 'verification.md'), 'utf8');
  } catch {
    console.log(`\x1b[33mWarning: specs/${featureId}/verification.md not found.\x1b[0m`);
  }

  // Extract REQ- tags
  const reqMatches = specContent.match(/REQ-[A-Z0-9_-]+/g) || [];
  const uniqueReqs = [...new Set(reqMatches)];

  // Extract TASK- tags
  const taskMatches = tasksContent.match(/TASK-[A-Z0-9_.-]+/g) || [];
  const uniqueTasks = [...new Set(taskMatches)];

  // Check unchecked tasks
  const pendingTasks = (tasksContent.match(/- \[ \] .+/g) || []).length;
  const completedTasks = (tasksContent.match(/- \[x\] .+/g) || []).length;

  console.log(`\x1b[1mTraceability Matrix:\x1b[0m`);
  console.log(`  • Requirements declared: \x1b[36m${uniqueReqs.length}\x1b[0m (${uniqueReqs.join(', ') || 'None'})`);
  console.log(`  • Vertical tasks broken out: \x1b[36m${uniqueTasks.length}\x1b[0m (${completedTasks} done, ${pendingTasks} pending)`);

  let driftFound = false;

  if (pendingTasks > 0) {
    console.log(`\x1b[31m✗ DRIFT:\x1b[0m ${pendingTasks} task(s) remain uncompleted in tasks.md`);
    driftFound = true;
  }

  for (const req of uniqueReqs) {
    if (!tasksContent.includes(req)) {
      console.log(`\x1b[31m✗ UNMAPPED REQUIREMENT:\x1b[0m ${req} is defined in spec.md but not referenced in tasks.md`);
      driftFound = true;
    }
  }

  if (!driftFound && uniqueReqs.length > 0) {
    console.log(`\n\x1b[32m✓ ZERO DRIFT DETECTED:\x1b[0m Specification, Tasks, and Implementation are fully converged!`);
  } else if (uniqueReqs.length === 0) {
    console.log(`\n\x1b[33mℹ Incomplete specification data for ${featureId}. Run 'eos stage specify ${featureId}'\x1b[0m`);
  } else {
    console.log(`\n\x1b[33m⚠️ Drift detected between specification and execution artifacts.\x1b[0m`);
  }
}
