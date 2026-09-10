import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

test('Contract Testing — OpenAPI 3.1 & Schema Validation', async (t) => {
  const projectRoot = process.cwd();
  const openapiPath = path.join(projectRoot, 'contracts', 'openapi.yaml');
  const openapiContent = await fs.readFile(openapiPath, 'utf8');

  await t.test('contracts/openapi.yaml is populated and well-formed', () => {
    assert.ok(openapiContent.includes('openapi: 3.1.0'));
    assert.ok(openapiContent.includes('title: Agentic SDLC OS Standard API'));
  });

  await t.test('Required API endpoints are specified', () => {
    assert.ok(openapiContent.includes('/healthz:'));
    assert.ok(openapiContent.includes('/api/v1/tasks:'));
    assert.ok(openapiContent.includes('operationId: createTask'));
    assert.ok(openapiContent.includes('operationId: listTasks'));
  });

  await t.test('RFC 7807 Problem Details Error Schema is referenced', () => {
    assert.ok(openapiContent.includes('application/problem+json'));
    assert.ok(openapiContent.includes('ErrorResponse:'));
  });

  await t.test('JSON schemas in contracts/schemas/ are valid JSON', async () => {
    const schemasDir = path.join(projectRoot, 'contracts', 'schemas');
    const files = await fs.readdir(schemasDir);
    for (const f of files) {
      if (f.endsWith('.json')) {
        const raw = await fs.readFile(path.join(schemasDir, f), 'utf8');
        const parsed = JSON.parse(raw);
        assert.ok(parsed.title);
        assert.equal(parsed.type, 'object');
      }
    }
  });
});
