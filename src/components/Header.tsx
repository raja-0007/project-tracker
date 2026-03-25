import { Menu, UsersRound } from 'lucide-react'
type props = {
    active:string,
    setActive:Function
}
const Header = ({active, setActive}:props) => {
    const tabs = ['Kanban', 'List', 'Timeline']
  return (
    <div className='w-full border-b border-slate-200 bg-white px-4 py-4 md:px-6 xl:flex xl:items-center xl:justify-between'>
        <div className='flex items-center gap-3'>
            <div className='rounded-xl bg-slate-100 p-2 text-slate-700'>
                <Menu className='h-5 w-5'/>
            </div>
            <div>
                <h1 className='text-xl font-bold text-slate-900 md:text-2xl'>Project Tracker</h1>
                <p className='text-sm text-slate-500'>Track work across board, list, and timeline views.</p>
            </div>
        </div>
        <div className='mt-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between xl:mt-0 xl:justify-end'>
            <div className='inline-flex w-full overflow-x-auto rounded-xl bg-slate-100 p-1 md:w-auto'>
                {tabs.map((tab, index) => (
                    <button type='button' key={index} 
                    className={`min-w-[7rem] rounded-lg px-4 py-2 text-sm font-medium transition-colors md:min-w-0 ${active === tab ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-slate-600 hover:bg-slate-200'}`}
                    onClick={() => setActive(tab)}>
                        {tab}</button>
                ))}
            </div>
            <div className='flex h-11 w-11 items-center justify-center self-end rounded-full border border-slate-200 bg-slate-100 text-slate-700 md:self-auto'><UsersRound className='h-5 w-5'/></div>
        </div>
    </div>
  )
}

export default Header
