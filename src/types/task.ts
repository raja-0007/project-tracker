export type Priority = 'critical' | 'high' | 'medium' | 'low'

export type taskStatus = 'todo' | 'inprogress' | 'inreview' | 'done'

export type Task = {
    id: string,
    title: string,
    status: taskStatus,
    priority: Priority,
    assignee: { name: string, color: string },
    startDate: string | null,
    dueDate: string,
}

export type Filters = {
    status: string[];
    priority: string[];
    assignee: string;
    dateFrom: string;
    dateTo: string;
};