
const PriorityLabel = ({priority}:{priority: 'critical' | 'high' | 'medium' | 'low'}) => {
    const priorityColors = {
        critical: { bg: 'bg-red-100', markBg: 'bg-red-700' },
        high: { bg: 'bg-orange-100', markBg: 'bg-orange-700' },
        medium: { bg: 'bg-amber-100', markBg: 'bg-amber-700' },
        low: { bg: 'bg-blue-100', markBg: 'bg-blue-700' },
    }
    return (
        <div className={` ${priorityColors[priority]?.bg || priorityColors['low']?.bg} px-2 py-1 flex items-center gap-2 rounded-full w-max capitalize text-xs font-medium`}>
            <div
                className={` h-2 w-2 rounded-full ${priorityColors[priority]?.markBg || priorityColors['low']?.markBg}`}></div>
            {priority}
        </div>
    )
}

export default PriorityLabel