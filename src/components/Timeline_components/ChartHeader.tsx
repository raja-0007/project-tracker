const priorityLabels = [
    { label: "Critical", bg: "#fee2e2", mark: "#dc2626" },
    { label: "High", bg: "#e0f2fe", mark: "#0284c7" },
    { label: "Medium", bg: "#fef9c3", mark: "#ca8a04" },
    { label: "Low", bg: "#dcfce7", mark: "#16a34a" },
];

type props = {
    moveToToday: () => void;
    moveToYesterday: () => void;
    moveToTomorrow: () => void;
}
const ChartHeader = ({ moveToToday, moveToYesterday, moveToTomorrow }: props) => {
    return (
        <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

        <div className="flex flex-wrap items-center gap-3 px-1">
            {priorityLabels.map((item) => (
                <div
                    key={item.label}
                    className="flex items-center gap-2 px-3 py-1 rounded-md border border-gray-100 bg-white shadow-sm"
                >
                    <span
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: item.mark }}
                    />
                    <span className="text-sm text-gray-700">{item.label}</span>
                </div>
            ))}
        </div>
        <div className="flex flex-wrap gap-2">
  <button
    onClick={moveToYesterday}
    className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-300"
  >
    Yesterday
  </button>

  <button
    onClick={moveToToday}
    className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
  >
    Today
  </button>

  <button
    onClick={moveToTomorrow}
    className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-300"
  >
    Tomorrow
  </button>
</div>
        </div>
    );
};

export default ChartHeader;
