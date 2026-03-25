import dayjs from "dayjs";
import { createContext, useContext, useMemo, useState } from "react";
import type { Filters, Task, taskStatus } from "../types/task";
import { buildSeedTasks } from "../data/taskSeed";

const tasksContext = createContext<{
    initialTasks: Task[],
    setInitialTasks: React.Dispatch<React.SetStateAction<Task[]>>,
    filteredTasks: Task[],
    handleDrop: (e: React.DragEvent<HTMLDivElement>, varient: taskStatus) => void,
    draggingTask: string | null,
    setDraggingTask: React.Dispatch<React.SetStateAction<string | null>>,
    handleDragOver: (e: React.DragEvent<HTMLDivElement>, varient: taskStatus, ref: React.RefObject<HTMLDivElement | null>) => void,
} | null>(null)

const taskList: Task[] = buildSeedTasks();
export const TasksProvider = ({ children, filters }: { children: React.ReactNode, filters: Filters }) => {
    const [initialTasks, setInitialTasks] = useState<Task[]>(taskList)

    const [draggingTask, setDraggingTask] = useState<string | null>(null)

    const filteredTasks = useMemo(() => {
        return initialTasks.filter((task) => {
            if (task.id === "dragging-task") return true;

            if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
                return false;
            }

            if (filters.status.length > 0 && !filters.status.includes(task.status)) {
                return false;
            }

            if (
                filters.assignee &&
                !task.assignee.name.toLowerCase().includes(filters.assignee.toLowerCase())
            ) {
                return false;
            }

            const taskStart = task.startDate || task.dueDate;
            const taskEnd = task.dueDate || task.startDate;

            if (!taskStart || !taskEnd) return false;

            const start = dayjs(taskStart);
            const end = dayjs(taskEnd);

            if (filters.dateFrom && end.isBefore(dayjs(filters.dateFrom), "day")) {
                return false;
            }

            if (filters.dateTo && start.isAfter(dayjs(filters.dateTo), "day")) {
                return false;
            }

            return true;
        });
    }, [filters, initialTasks]);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, varient: taskStatus) => {

        const taskId = e.dataTransfer.getData("taskId")
        let newTask = initialTasks.find(task => task.id === taskId)
        setDraggingTask(null)
        
        if (!newTask) return;
        else if (newTask.status === varient) return
        else {

            newTask.status = varient
            let newTasks = initialTasks.filter(task => task.id !== taskId && task.id !== 'dragging-task')
            newTasks.push(newTask)
            setInitialTasks(newTasks)
        }

    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, varient: taskStatus, ref: React.RefObject<HTMLDivElement | null>) => {
        e.preventDefault()
        let newTask = initialTasks.find(task => task.id === draggingTask)
        console.log("Dragging over:", varient, "with task: and taskId:", newTask, draggingTask);
        if (!newTask) return;
        else if (newTask.status === varient){
            setInitialTasks(prev => prev.filter(task => task.id !== 'dragging-task'));
            return
        }
        else if(initialTasks.some(task=>task.id === 'dragging-task')){
            if(ref && ref.current){
              ref.current.scrollTop = ref.current.scrollHeight;
            }
            setInitialTasks(prev => prev.map(task => {
                if (task.id === 'dragging-task') {
                    return {
                        ...task,
                        status: varient
                    }
                }
                return task
            }))
        }else{
            setInitialTasks([...initialTasks, { id: 'dragging-task', title: '', status: varient, priority: 'low', assignee: { name: '', color: '' }, startDate: null, dueDate: '' }])
        }
    }
    
    return (
        <tasksContext.Provider value={{ initialTasks, setInitialTasks, filteredTasks,
         handleDrop, handleDragOver, draggingTask, setDraggingTask}}>
            {children}
        </tasksContext.Provider>
    )
}

export const useTasks = () => {
    const context = useContext(tasksContext);

    if (!context) {
        throw new Error("useTasks must be used within TasksProvider");
    }

    return context;
};
