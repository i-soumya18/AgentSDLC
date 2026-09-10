import test from 'node:test';
import assert from 'node:assert/strict';
import { TaskRepository } from '../../src/features/tasks/task.repository.js';
import { TaskService } from '../../src/features/tasks/task.service.js';
import { TaskController } from '../../src/features/tasks/task.controller.js';

test('Feature 001 — AI Task Copilot Unit Tests', async (t) => {
  const repo = new TaskRepository();
  const service = new TaskService(repo);
  const controller = new TaskController(service);

  await t.test('REQ-001.1: Creates task successfully and returns 201 Created', async () => {
    const response = await controller.handleCreateTask({
      body: { title: 'Implement user authentication slice', tags: ['auth'] }
    });

    assert.equal(response.status, 201);
    assert.ok(response.body.id.startsWith('task_'));
    assert.equal(response.body.title, 'Implement user authentication slice');
    assert.equal(response.body.status, 'todo');
    assert.deepEqual(response.body.tags, ['auth']);
  });

  await t.test('REQ-001.2: Rejects blank title with RFC 7807 problem details', async () => {
    const response = await controller.handleCreateTask({
      body: { title: '   ' }
    });

    assert.equal(response.status, 400);
    assert.equal(response.body.type, 'https://api.example.com/errors/validation-error');
    assert.equal(response.body.status, 400);
    assert.ok(response.body.detail.includes('title'));
    assert.equal(response.headers['Content-Type'], 'application/problem+json');
  });

  await t.test('Resilience: Idempotency-Key returns cached response on duplicate request', async () => {
    const headers = { 'Idempotency-Key': 'key_abc_123' };
    const firstRes = await controller.handleCreateTask({
      body: { title: 'Idempotent slice' },
      headers
    });
    const secondRes = await controller.handleCreateTask({
      body: { title: 'Idempotent slice' },
      headers
    });

    assert.equal(firstRes.status, 201);
    assert.equal(secondRes.status, 201);
    assert.equal(firstRes.body.id, secondRes.body.id);
  });
});
