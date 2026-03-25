
import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Kanban from './components/kanban_components/Kanban'
import { TasksProvider } from './contexts/tasks'
import ListView from './components/list_components/ListView'
import GanttView from './components/Timeline_components/VisGanttView'
import FilterBar from './components/FilterBar'
import type { Filters } from './types/task'

function App() {
  const [active, setActive] = useState('List')

  const getInitialFilters = (): Filters => {
        const params = new URLSearchParams(window.location.search)

        return {
            status: params.getAll('status'),
            priority: params.getAll('priority'),
            assignee: params.get('assignee') || '',
            dateFrom: params.get('dateFrom') || '',
            dateTo: params.get('dateTo') || '',
        }
    }
    const [filters, setFilters] = useState<Filters>(getInitialFilters)
  return (
    <TasksProvider filters={filters}>

      <main className='min-h-screen bg-slate-50'>
        <Header active={active} setActive={setActive} />
        {active !== 'Kanban' && (
          <div className='px-4 pt-4 md:px-6'>
            <FilterBar filters={filters} setFilters={setFilters} />
          </div>
        )}
        {active === 'Kanban' ? <Kanban filters={filters} setFilters={setFilters}/> :
          active === 'List' ? <ListView filters={filters} setFilters={setFilters} /> : 
          <GanttView/>}
      </main>
    </TasksProvider>
  )
}

export default App
