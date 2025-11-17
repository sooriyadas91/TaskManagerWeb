export interface Task {
id: number;
title: string;
description?: string;
assignee?: string;
statusId: number;
priorityId: number;
status?: string;
dueDate?: Date;
priority?: string;
}

export interface PagedTasks {
  items: Task[];
  totalCount: number;
}