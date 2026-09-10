import { TaskEntity } from './task.entity.js';

export class TaskRepository {
  constructor() {
    this.tasks = new Map();
  }

  async save(task) {
    if (!(task instanceof TaskEntity)) {
      throw new Error("Invalid entity type: expected TaskEntity");
    }
    this.tasks.set(task.id, task);
    return task;
  }

  async findById(id) {
    return this.tasks.get(id) || null;
  }

  async list({ limit = 20 } = {}) {
    return Array.from(this.tasks.values()).slice(0, limit);
  }

  async clear() {
    this.tasks.clear();
  }
}
