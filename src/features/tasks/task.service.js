import { TaskEntity } from './task.entity.js';

export class TaskService {
  constructor(taskRepository) {
    this.repo = taskRepository;
    this.idempotencyStore = new Map();
  }

  async createTask({ title, description, tags, idempotencyKey }) {
    if (idempotencyKey && this.idempotencyStore.has(idempotencyKey)) {
      return this.idempotencyStore.get(idempotencyKey);
    }

    const task = new TaskEntity({ title, description, tags });
    const saved = await this.repo.save(task);

    if (idempotencyKey) {
      this.idempotencyStore.set(idempotencyKey, saved);
    }

    return saved;
  }

  async listTasks({ limit } = {}) {
    return this.repo.list({ limit });
  }
}
