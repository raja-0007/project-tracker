import { Calendar } from "lucide-react";
import type { Task, taskStatus } from "../../types/task";
import Avatar from "../ui/Avatar";
import PriorityLabel from "../ui/PriorityLabel";
import Select from "../ui/Select";
import { forwardRef } from "react";

type Props = {
  task: Task;
  dueLabel: string;
  isOverdue: boolean;
  handleStatusChange: (taskId: string, newStatus: taskStatus) => void;
  style?: React.CSSProperties; // 🔥 required for virtualization
};

const ListViewRow = forwardRef<HTMLDivElement, Props>(
  ({ task, dueLabel, isOverdue, handleStatusChange, style }, ref) => {
    const statusOptions: { value: taskStatus; label: string }[] = [
      { value: "todo", label: "To Do" },
      { value: "inprogress", label: "In Progress" },
      { value: "inreview", label: "In Review" },
      { value: "done", label: "Done" },
    ];

    const variants = {
      todo: "text-blue-700 border-blue-700",
      inprogress: "text-amber-700 border-amber-700",
      inreview: "text-red-700 border-red-700",
      done: "text-green-700 border-green-700",
    };

    return (
      <div
        ref={ref}
        style={style} // 🔥 IMPORTANT (positioning)
        className="flex min-w-[980px] items-center border-b border-slate-200 bg-white text-sm text-slate-700"
      >
        {/* Title */}
        <div className="w-[280px] shrink-0 px-4 py-2.5 font-medium text-slate-900">
          {task.title}
        </div>

        {/* Assignee */}
        <div className="w-[220px] shrink-0 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Avatar
              text={task.assignee.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            />
            {task.assignee.name}
          </div>
        </div>

        {/* Priority */}
        <div className="w-[150px] shrink-0 px-4 py-2.5">
          <PriorityLabel priority={task.priority} />
        </div>

        {/* Status */}
        <div className="w-[190px] shrink-0 px-4 py-2.5">
          <Select
            options={statusOptions}
            className={variants[task.status] || variants["todo"]}
            onChange={(e) =>
              handleStatusChange(task.id, e.target.value as taskStatus)
            }
            value={task.status}
          />
        </div>

        {/* Due Date */}
        <div
          className={`w-[140px] shrink-0 px-4 py-2.5 ${
            isOverdue ? "text-red-500" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            {dueLabel}
          </div>
        </div>
      </div>
    );
  }
);

ListViewRow.displayName = "ListViewRow";

export default ListViewRow;
