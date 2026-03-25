import React, { useRef } from 'react'
import { useTasks } from '../../contexts/tasks'
type props = {
    children: React.ReactNode,
    className?: string
}
type Varient = 'todo' | 'inprogress' | 'inreview' | 'done'

const Card = ({ children, className, varient }: props & { varient: Varient }) => {
    
    const varients = {
        'todo': 'bg-blue-50',
        'inprogress': 'bg-amber-50',
        'inreview': 'bg-red-50',
        'done': 'bg-green-50',
    }

    const { handleDrop, handleDragOver } = useTasks()
    const cardRef = useRef<HTMLDivElement | null>(null);

    return (
        <div ref={cardRef} onDragOver={(e)=>{e.preventDefault();handleDragOver(e, varient, cardRef)}} onDrop={(e)=>handleDrop(e, varient)} className={`min-h-[24rem] overflow-auto rounded-2xl shadow-md ${className} ${varients[varient] || varients['todo']}`}>
            {children}
        </div>
    )
}

const CardHeader = ({ title, varient }: { title: string, varient: Varient }) => {
    
    const varients = {
        'todo': 'text-blue-800 bg-blue-100',
        'inprogress': 'text-amber-800 bg-amber-100',
        'inreview': 'text-red-800 bg-red-100',
        'done': 'text-green-800 bg-green-100',
    }
    return (
        <div className={`flex items-center justify-between rounded-t-2xl p-3 px-4 ${varients[varient] || varients['todo']}`}>
            <h2 className='text-lg font-bold'>{title}</h2>
        </div>
    )
}

const CardBody = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='p-4'>
            {children}
        </div>
    )
}


export { Card, CardHeader, CardBody }
