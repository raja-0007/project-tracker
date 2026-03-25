import { useEffect, useMemo, useState } from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { useTasks } from '../../contexts/tasks'
import KanbanCard from './KanbanCard'
import { AnimatePresence, motion } from 'framer-motion'
import FilterBar from '../FilterBar'
import type { Filters } from '../../types/task'
type user = {
    id: string,
    name: string,
    viewing: string,
    color?: string
}
let users: user[] = [
    {
        id: '1',
        name: 'John Doe',
        viewing: 'task-2',
        color: '#6366f1'
    },
    {
        id: '2',
        name: 'Jane Doe',
        viewing: 'task-4',
        color: '#f59e0b'
    },
    {
        id: '3',
        name: 'Bob Smith',
        viewing: 'task-6',
        color: '#10b981'
    },
    {
        id: '4',
        name: 'Alice Johnson',
        viewing: 'task-8',
        color: '#ef4444'
    },
]



const Kanban = ({filters, setFilters}: { filters: Filters; setFilters: React.Dispatch<React.SetStateAction<Filters>> }) => {
    const { initialTasks, filteredTasks } = useTasks()

    const todoTasks = useMemo(() => filteredTasks.filter(task => task.status === 'todo'), [filteredTasks])
    const inProgressTasks = useMemo(() => filteredTasks.filter(task => task.status === 'inprogress'), [filteredTasks])
    const inReviewTasks = useMemo(() => filteredTasks.filter(task => task.status === 'inreview'), [filteredTasks])
    const doneTasks = useMemo(() => filteredTasks.filter(task => task.status === 'done'), [filteredTasks])
    const [activeUsers, setActiveUsers] = useState<user[]>(users)

    useEffect(() => {
        const interval = setInterval(() => {
            if (initialTasks.length === 0) return;

            setActiveUsers(prevUsers => {
                let newUsers = [...prevUsers];
                const randomUserIndex = Math.floor(Math.random() * newUsers.length);
                let randomUser = newUsers[randomUserIndex];
                randomUser.viewing = initialTasks[Math.floor(Math.random() * initialTasks.length)].id;
                newUsers[randomUserIndex] = randomUser;

                // newUsers.forEach(user => {
                //     const randomTaskIndex = Math.floor(Math.random() * initialTasks.length);
                //     user.viewing = initialTasks[randomTaskIndex].id;
                // });
                return newUsers;
            });
        }, 4000);
        return () => clearInterval(interval);
    }, [initialTasks])

    const activeCount = useMemo(() => {
        return activeUsers.length
    }, [activeUsers])

    return (
        <div className='grid w-full grid-cols-1 gap-4 bg-slate-50 p-4 md:h-[calc(100vh-10rem)] md:grid-cols-2 md:grid-rows-[auto_minmax(0,1fr)_minmax(0,1fr)] md:gap-5 md:p-6 xl:h-[calc(100vh-6.5rem)] xl:grid-cols-4 xl:grid-rows-[auto_minmax(0,1fr)]'>
            <div
                className='col-span-1 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-2 xl:col-span-4 xl:flex-row xl:items-center xl:justify-between'>
                <div className='flex flex-wrap items-center gap-3'>
                    <div className='flex'>
                    {activeUsers.map((u, i) => (
                        <div key={u.id} style={{ marginLeft: i ? -6 : 0 }}>
                            <Avatar user={u} size={26} />
                        </div>
                    ))}
                </div>
                <span className='text-sm text-slate-600'><strong className='text-slate-900'>{activeCount}</strong> {activeCount === 1 ? 'person is' : 'people are'} viewing this board</span>
                </div>
                <FilterBar filters={filters} setFilters={setFilters} />
            </div>
            <Card className='min-h-0 p-0' varient='todo'>
                <CardHeader title='To Do' varient='todo' count={todoTasks.length} />
                <CardBody>
                    {todoTasks.length === 0 && <EmptyColumnState varient='todo' />}
                    {todoTasks.map(task => {
                        return (
                            <div key={task.id}>
                                <KanbanCard key={task.id} task={task} varient='todo' />
                                <CardPresence taskId={task.id} />
                            </div>
                        )
                    })}
                </CardBody>
            </Card>
            <Card className='min-h-0 p-0' varient='inprogress'>
                <CardHeader title='In Progress' varient='inprogress' count={inProgressTasks.length} />
                <CardBody>
                    {inProgressTasks.length === 0 && <EmptyColumnState varient='inprogress' />}
                    {inProgressTasks.map(task => {
                        return (
                            <div key={task.id}>
                                <KanbanCard key={task.id} task={task} varient='inprogress' />
                                <CardPresence taskId={task.id} />
                            </div>
                        )
                    })}
                </CardBody>
            </Card>
            <Card className='min-h-0 p-0' varient='inreview'>
                <CardHeader title='In Review' varient='inreview' count={inReviewTasks.length} />
                <CardBody>
                    {inReviewTasks.length === 0 && <EmptyColumnState varient='inreview' />}
                    {inReviewTasks.map(task => {
                        return (
                            <div key={task.id}>
                                <KanbanCard key={task.id} task={task} varient='inreview' />
                                <CardPresence taskId={task.id} />
                            </div>
                        )
                    })}
                </CardBody>
            </Card>
            <Card className='min-h-0 p-0' varient='done'>
                <CardHeader title='Done' varient='done' count={doneTasks.length} />
                <CardBody>
                    {doneTasks.length === 0 && <EmptyColumnState varient='done' />}
                    {doneTasks.map(task => {
                        return (
                            <div key={task.id}>
                                <KanbanCard key={task.id} task={task} varient='done' />
                                <CardPresence taskId={task.id} />
                            </div>
                        )
                    })}
                </CardBody>

            </Card>
        </div>
    )
}

function EmptyColumnState({ varient }: { varient: 'todo' | 'inprogress' | 'inreview' | 'done' }) {
    const accents = {
        todo: {
            ring: 'border-blue-200 bg-blue-50/80',
            badge: 'bg-blue-100 text-blue-700',
            title: 'No tasks to start',
            body: 'Nothing in this lane right now. Adjust filters or drag a task here to kick work off.',
        },
        inprogress: {
            ring: 'border-amber-200 bg-amber-50/80',
            badge: 'bg-amber-100 text-amber-700',
            title: 'No work in progress',
            body: 'This column is clear for now. Matching tasks will appear here once work gets underway.',
        },
        inreview: {
            ring: 'border-rose-200 bg-rose-50/80',
            badge: 'bg-rose-100 text-rose-700',
            title: 'Nothing waiting on review',
            body: 'There are no tasks in review. Try broadening filters if you expected something here.',
        },
        done: {
            ring: 'border-emerald-200 bg-emerald-50/80',
            badge: 'bg-emerald-100 text-emerald-700',
            title: 'No completed tasks yet',
            body: 'Completed work will collect here. Clear filters if you want to see the full history.',
        },
    }

    const accent = accents[varient]

    return (
        <div className={`rounded-2xl border border-dashed p-5 text-center ${accent.ring}`}>
            <div className={`mx-auto mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${accent.badge}`}>
                Empty column
            </div>
            <h3 className='text-sm font-semibold text-slate-900'>{accent.title}</h3>
            <p className='mt-2 text-sm leading-6 text-slate-500'>{accent.body}</p>
        </div>
    )
}

function Avatar({ user, size = 24 }: { user: user, size?: number }) {
    return (
        <motion.div
            layout
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            title={user.name}
            style={{
                width: size, height: size, borderRadius: '50%',
                background: user.color, border: '2px solid white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: size * 0.42, fontWeight: 700, color: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)', flexShrink: 0,
            }}
        >
            {user.name[0]}
        </motion.div>
    )
}

function CardPresence({ taskId }: { taskId: string }) {
    const here = users.filter(u => u.viewing === taskId)
    if (!here.length) return null

    return (
        <div style={{ display: 'flex', marginTop: 6, paddingLeft: 4 }}>
            <AnimatePresence>
                {here.slice(0, 3).map((u, i) => (
                    <div key={u.id} style={{ marginLeft: i ? -8 : 0, zIndex: 10 - i }}>
                        <Avatar user={u} size={22} />
                    </div>
                ))}
                {here.length > 3 && (
                    <motion.div
                        key="more"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        style={{
                            width: 22, height: 22, borderRadius: '50%', marginLeft: -8,
                            background: '#94a3b8', border: '2px solid white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 9, fontWeight: 700, color: '#fff',
                        }}
                    >
                        +{here.length - 3}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Kanban
