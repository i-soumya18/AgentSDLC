import { randomUUID } from 'node:crypto';

export class TaskEntity {
  constructor({ id, title, description = '', status = 'todo', tags = [], createdAt, updatedAt }) {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      throw new Error("Task title must be a non-empty string.");
    }
    if (title.length > 255) {
      throw new Error("Task title must not exceed 255 characters.");
    }

    this.id = id || `task_${randomUUID().slice(0, 8)}`;
    this.title = title.trim();
    this.description = description;
    this.status = status;
    this.tags = Array.isArray(tags) ? tags : [];
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
