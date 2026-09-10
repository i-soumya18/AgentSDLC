export class TaskController {
  constructor(taskService) {
    this.service = taskService;
  }

  async handleCreateTask(req) {
    const { body, headers = {} } = req;
    const idempotencyKey = headers['idempotency-key'] || headers['Idempotency-Key'];

    if (!body || !body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return {
        status: 400,
        headers: { 'Content-Type': 'application/problem+json' },
        body: {
          type: 'https://api.example.com/errors/validation-error',
          title: 'Invalid Request Parameters',
          status: 400,
          detail: "The 'title' field is required and must not be blank.",
          instance: '/api/v1/tasks',
          invalidParams: [{ name: 'title', reason: 'must not be blank' }],
          requestId: headers['x-request-id'] || 'req_auto'
        }
      };
    }

    try {
      const task = await this.service.createTask({
        title: body.title,
        description: body.description,
        tags: body.tags,
        idempotencyKey
      });

      return {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: task.toJSON()
      };
    } catch (err) {
      return {
        status: 500,
        headers: { 'Content-Type': 'application/problem+json' },
        body: {
          type: 'https://api.example.com/errors/internal',
          title: 'Internal Server Error',
          status: 500,
          detail: err.message,
          instance: '/api/v1/tasks',
          requestId: headers['x-request-id'] || 'req_auto'
        }
      };
    }
  }

  async handleListTasks(req) {
    const limit = parseInt(req?.query?.limit, 10) || 20;
    const tasks = await this.service.listTasks({ limit });
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        items: tasks.map(t => t.toJSON()),
        nextCursor: null
      }
    };
  }
}
