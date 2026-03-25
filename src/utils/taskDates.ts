import dayjs from "dayjs";
import type { Task } from "../types/task";

export const getTaskDueDateMeta = (
    task: Task,
    options?: { defaultFormat?: string }
) => {
    const dueDate = dayjs(task.dueDate);
    const today = dayjs();
    const overdueDays = today.startOf("day").diff(dueDate.startOf("day"), "day");
    const isOverdue = overdueDays > 0 && task.status !== "done";
    const defaultFormat = options?.defaultFormat ?? "MMM DD YYYY";

    if (dueDate.isSame(today, "day")) {
        return {
            label: "Due Today",
            isOverdue: false,
        };
    }

    if (isOverdue && overdueDays > 7) {
        return {
            label: `${overdueDays} days overdue`,
            isOverdue: true,
        };
    }

    return {
        label: dueDate.format(defaultFormat),
        isOverdue,
    };
};
