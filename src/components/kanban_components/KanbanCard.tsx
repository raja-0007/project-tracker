import type { Task } from '../../types/task'
import { Clock, Ellipsis } from 'lucide-react'
import { useTasks } from '../../contexts/tasks'
import { useRef } from 'react'
import Avatar from '../ui/Avatar'
import PriorityLabel from '../ui/PriorityLabel'
import { getTaskDueDateMeta } from '../../utils/taskDates'



const KanbanCard = ({ task, varient }: { task: Task; varient: 'todo' | 'inprogress' | 'inreview' | 'done' }) => {
    const { draggingTask, setDraggingTask } = useTasks()
    const cardRef = useRef<HTMLDivElement | null>(null);
    const varients = {
        'todo': 'bg-blue-100',
        'inprogress': 'bg-amber-100',
        'inreview': 'bg-red-100',
        'done': 'bg-green-100',
    }
    const { label, isOverdue } = getTaskDueDateMeta(task, { defaultFormat: "MMM D" })
    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("taskId", task.id);
        e.dataTransfer.dropEffect = "move";
        if (cardRef.current) {
            const clone = cardRef.current.cloneNode(true) as HTMLElement;

            // Make it visible to browser but not user
            clone.style.position = "fixed";
            clone.style.top = "0px";
            clone.style.left = "0px";
            clone.style.zIndex = "9999";
            clone.style.pointerEvents = "none";
            clone.style.opacity = "1";
            clone.style.background = "white";
            clone.style.boxShadow = "0 12px 30px rgba(0,0,0,0.3)"; // keep full visible for drag engine

            document.body.appendChild(clone);

            // Center preview under cursor
            const rect = cardRef.current.getBoundingClientRect();

            e.dataTransfer.setDragImage(
                clone,
                rect.width / 2,
                rect.height / 2
            );

            setTimeout(() => {
                document.body.removeChild(clone);
            }, 0);
        }
        setDraggingTask(task.id)
    }
    return (
        <div ref={cardRef} draggable onDragStart={handleDrag} className={`bg-white p-2 relative rounded-lg shadow-sm mb-3 cursor-grab`}>
            <div className='flex items-center gap-2 mb-2'>
                <Avatar text={task.assignee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}/>
                <PriorityLabel priority={task.priority} />
                <div className='ml-auto'>
                    <Ellipsis />
                </div>
            </div>
            <div className=' w-full text-wrap text-lg font-semibold capitalize'>
                {task.title}
            </div>
            <div className={`text-xs flex items-center gap-2  mt-2 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                <Clock size={15} /> {label}
            </div>
            {(draggingTask === task.id || task.id === 'dragging-task') && (
                <div className={`absolute inset-0 ${varients[varient] || varients['todo']} rounded-lg`}></div>
            )}
        </div>
    )
}

export default KanbanCard
