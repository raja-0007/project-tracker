import dayjs from "dayjs";
import type { Priority, Task, taskStatus } from "../types/task";

const SEED_COUNT = 540;

const assignees = [
    { name: "Chris Morris", color: "#3b82f6" },
    { name: "Jack Daniels", color: "#ef4444" },
    { name: "Walter White", color: "#10b981" },
    { name: "Pam Beesly", color: "#ec4899" },
    { name: "Dwight Schrute", color: "#f59e0b" },
    { name: "Michael Scott", color: "#6366f1" },
] as const;

const verbs = [
    "Implement",
    "Refactor",
    "Audit",
    "Ship",
    "Polish",
    "Validate",
    "Review",
    "Prototype",
    "Optimize",
    "Stabilize",
] as const;

const subjects = [
    "task filtering",
    "timeline rendering",
    "kanban drop zones",
    "list virtualization",
    "accessibility pass",
    "error boundary flow",
    "sorting behavior",
    "date formatting",
    "presence indicators",
    "analytics widgets",
] as const;

const qualifiers = [
    "for enterprise rollout",
    "before release freeze",
    "for stakeholder review",
    "with regression coverage",
    "for tablet layouts",
    "for large datasets",
    "under slow network conditions",
    "with keyboard support",
    "for shared board sessions",
    "ahead of demo day",
] as const;

const priorities: Priority[] = ["critical", "high", "medium", "low"];
const statuses: taskStatus[] = ["todo", "inprogress", "inreview", "done"];

const createSeededRandom = (seed: number) => {
    let value = seed >>> 0;

    return () => {
        value = (value * 1664525 + 1013904223) % 4294967296;
        return value / 4294967296;
    };
};

const randomItem = <T,>(items: readonly T[], random: () => number) => {
    return items[Math.floor(random() * items.length)];
};

const buildTitle = (index: number, random: () => number) => {
    const verb = randomItem(verbs, random);
    const subject = randomItem(subjects, random);
    const qualifier = randomItem(qualifiers, random);

    return `${verb} ${subject} ${qualifier} #${index + 1}`;
};

export const buildSeedTasks = (): Task[] => {
    const random = createSeededRandom(20260325);
    const today = dayjs().startOf("day");

    return Array.from({ length: SEED_COUNT }, (_, index) => {
        const status = statuses[index % statuses.length];
        const priority = priorities[Math.floor(random() * priorities.length)];
        const assignee = assignees[index % assignees.length];

        const isMissingStartDate = index % 11 === 0;
        const isOverdue = index % 7 === 0;

        let dueDate = today
            .add(Math.floor(random() * 28) - 8, "day")
            .hour(17)
            .minute(0)
            .second(0)
            .millisecond(0);

        if (isOverdue && status !== "done") {
            dueDate = today
                .subtract(2 + (index % 10), "day")
                .hour(17)
                .minute(0)
                .second(0)
                .millisecond(0);
        }

        if (!isOverdue && index % 9 === 0) {
            dueDate = today.hour(17).minute(0).second(0).millisecond(0);
        }

        const startOffset = 1 + Math.floor(random() * 6);
        const startDate = isMissingStartDate
            ? null
            : dueDate
                .subtract(startOffset, "day")
                .hour(9)
                .minute(0)
                .second(0)
                .millisecond(0)
                .toISOString();

        return {
            id: `task-${index + 1}`,
            title: buildTitle(index, random),
            status,
            priority,
            assignee: {
                name: assignee.name.toLowerCase(),
                color: assignee.color,
            },
            startDate,
            dueDate: dueDate.toISOString(),
        };
    });
};
