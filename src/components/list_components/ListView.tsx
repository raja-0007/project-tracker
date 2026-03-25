"use client";

import { useTasks } from "../../contexts/tasks";
import ListViewRow from "./ListViewRow";
import type { Filters, taskStatus } from "../../types/task";
import { useEffect, useMemo, useRef, useState } from "react";
import { getTaskDueDateMeta } from "../../utils/taskDates";

type SortKey = "title" | "priority" | "dueDate";
type SortOrder = "ascending" | "descending" | "none";

const ROW_HEIGHT = 64; 
const BUFFER = 10;

const EMPTY_FILTERS: Filters = {
  status: [],
  priority: [],
  assignee: "",
  dateFrom: "",
  dateTo: "",
};

const ListView = ({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}) => {
  const { filteredTasks, setInitialTasks } = useTasks();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    order: SortOrder;
  }>({
    key: "title",
    order: "ascending",
  });

  const handleStatusChange = (taskId: string, newStatus: taskStatus) => {
    setInitialTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const priorityOrder = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (sortConfig.order === "none") return 0;

      let result = 0;

      switch (sortConfig.key) {
        case "title":
          result = a.title.localeCompare(b.title);
          break;
        case "priority":
          result =
            priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case "dueDate":
          result =
            new Date(a.dueDate).getTime() -
            new Date(b.dueDate).getTime();
          break;
      }

      return sortConfig.order === "ascending" ? result : -result;
    });
  }, [filteredTasks, sortConfig]);

useEffect(() => {
  const el = scrollRef.current;
  if (!el) return;

  const handleScroll = () => {
    setScrollTop(el.scrollTop);
  };

  el.addEventListener("scroll", handleScroll);

  const resizeObserver = new ResizeObserver(() => {
    setContainerHeight(el.clientHeight);
  });
  resizeObserver.observe(el);

  return () => {
    el.removeEventListener("scroll", handleScroll);
    resizeObserver.disconnect();
  };
}, []);

  const total = sortedTasks.length;

  const startIndex = Math.floor(scrollTop / ROW_HEIGHT);
  const visibleCount = Math.ceil(containerHeight / ROW_HEIGHT);

  const from = Math.max(0, startIndex - BUFFER);
  const to = Math.min(total, startIndex + visibleCount + BUFFER);

  const visibleTasks = sortedTasks.slice(from, to);

  const totalHeight = total * ROW_HEIGHT;
  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.assignee !== "" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  const toggleSort = (key: SortKey) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          order:
            prev.order === "none"
              ? "ascending"
              : prev.order === "ascending"
              ? "descending"
              : "ascending",
        };
      }
      return { key, order: "ascending" };
    });
  };

  return (
    <div className="w-full bg-slate-50 p-4 md:p-6">
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="min-w-[980px]">
          <div className="sticky top-0 z-10 flex border-b border-slate-200 bg-slate-100 text-sm font-semibold text-slate-700">
            <div
              className="w-[280px] shrink-0 px-4 py-3 cursor-pointer"
              onClick={() => toggleSort("title")}
            >
              Title
            </div>
            <div className="w-[220px] shrink-0 px-4 py-3">Assignee</div>
            <div
              className="w-[150px] shrink-0 px-4 py-3 cursor-pointer"
              onClick={() => toggleSort("priority")}
            >
              Priority
            </div>
            <div className="w-[190px] shrink-0 px-4 py-3">Status</div>
            <div
              className="w-[140px] shrink-0 px-4 py-3 cursor-pointer"
              onClick={() => toggleSort("dueDate")}
            >
              Due Date
            </div>
          </div>

          <div
            ref={scrollRef}
            className="relative max-h-[calc(100vh-16rem)] overflow-auto"
          >
        {total === 0 && (
          <div className="flex min-h-72 items-center justify-center px-6 py-12">
            <div className="max-w-md rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-10 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                0
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                No tasks match these filters
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Try widening the date range, status, or assignee to bring tasks back into view.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={() => setFilters(EMPTY_FILTERS)}
                  className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
        <div
          className="relative min-w-[980px]"
          style={{ height: totalHeight, position: "relative" }}
        >
          {visibleTasks.map((task, index) => {
            const actualIndex = from + index;
            const { label, isOverdue } = getTaskDueDateMeta(task);

            return (
              <ListViewRow
                key={task.id}
                task={task}
                dueLabel={label}
                isOverdue={isOverdue}
                handleStatusChange={handleStatusChange}
                style={{
                  position: "absolute",
                  top: actualIndex * ROW_HEIGHT,
                  left: 0,
                  right: 0,
                  height: ROW_HEIGHT,
                }}
              />
            );
          })}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListView;
