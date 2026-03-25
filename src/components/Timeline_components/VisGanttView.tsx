"use client";

import { useEffect, useRef } from "react";
import { Timeline } from "vis-timeline/standalone";
import { DataSet } from "vis-data";
import "vis-timeline/styles/vis-timeline-graph2d.css";
import { useTasks } from "../../contexts/tasks";
import ChartHeader from "./ChartHeader";

const priorityColors = {
    critical: "bg-red-100 border border-red-400 text-red-700",
    high: "bg-blue-100 border border-blue-400 text-blue-700",
    medium: "bg-yellow-100 border border-yellow-500 text-yellow-700",
    low: "bg-green-100 border border-green-400 text-green-700",
};

const GanttView = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<any>(null);
    const { filteredTasks } = useTasks();

    useEffect(() => {
        if (!containerRef.current) return;


        const items = new DataSet(
            filteredTasks.map((task) => {
                const priority =
                    priorityColors[
                    task.priority.toLowerCase() as keyof typeof priorityColors
                    ] || "bg-gray-500";

                return {
                    id: task.id,
                    group: task.id,
                    start: task.startDate
                        ? task.startDate
                        : new Date(new Date(task.dueDate).setHours(0, 0, 0, 0)),
                    end: task.dueDate,
                    content: task.title,

                    className: `${priority} text-white rounded-md`,
                };
            })
        );

        const options = {
            stack: true,
            horizontalScroll: true,
            zoomKey: "ctrlKey" as const,
            maxHeight: "500px",
            selectable: false,
            editable: false,
            margin: {
                item: 10,
                axis: 5,
            },
            orientation: "top" as const,
        };

        const timeline = new Timeline(
            containerRef.current,
            items,
            options
        );

         timelineRef.current = timeline;

        return () => timeline.destroy();
    }, [filteredTasks]);

    const moveToToday = () => {
  timelineRef.current?.moveTo(new Date());
};

const moveToYesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  timelineRef.current?.moveTo(date);
};

const moveToTomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  timelineRef.current?.moveTo(date);
};

    return (
        <div className="w-full bg-slate-50 p-4 md:p-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <ChartHeader moveToToday={moveToToday} moveToYesterday={moveToYesterday} moveToTomorrow={moveToTomorrow}/>
            <div ref={containerRef} className="h-[32rem] w-full overflow-hidden md:h-[36rem]" />
            </div>
        </div>
    );
};

export default GanttView;
