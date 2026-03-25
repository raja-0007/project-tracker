import dayjs from "dayjs";
import { CalendarDays, ChevronDown, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import type { Filters } from "../types/task";

// ── color maps ────────────────────────────────────────────────────────────────

const priorityColors: Record<string, { bg: string; markBg: string }> = {
    critical: { bg: "bg-red-100", markBg: "bg-red-700" },
    high: { bg: "bg-orange-100", markBg: "bg-orange-700" },
    medium: { bg: "bg-amber-100", markBg: "bg-amber-700" },
    low: { bg: "bg-blue-100", markBg: "bg-blue-700" },
};

const statusColors: Record<string, string> = {
    todo: "bg-blue-50",
    inprogress: "bg-amber-50",
    inreview: "bg-red-50",
    done: "bg-green-50",
};

// ── types ─────────────────────────────────────────────────────────────────────

type SelectOption = { value: string; label: string };

type MultiSelectOption = SelectOption & {
    type?: "status" | "priority";
};

// ── Select ────────────────────────────────────────────────────────────────────

type SelectProps = {
    options: SelectOption[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
};

const Select = ({ options, value, onChange, className }: SelectProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const pick = (val: string) => {
        onChange({ target: { value: val } } as React.ChangeEvent<HTMLSelectElement>);
        setOpen(false);
    };

    return (
        <div ref={ref} className={`relative w-full sm:w-auto ${className ?? ""}`}>
            <div
                onClick={() => setOpen((p) => !p)}
                className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer bg-white hover:bg-gray-50 select-none"
            >
                <span className="text-sm font-medium text-gray-700">{selected?.label ?? "—"}</span>
                <ChevronDown size={13} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
            </div>

            {open && (
                <ul className="absolute z-50 mt-1 min-w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden py-1">
                    {options.map((opt) => (
                        <li
                            key={opt.value}
                            onClick={() => pick(opt.value)}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${value === opt.value ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                                }`}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// ── MultiSelect ───────────────────────────────────────────────────────────────

type MultiSelectProps = {
    label: string;
    options: MultiSelectOption[];
    selected: string[];
    onChange: (values: string[]) => void;
};

const MultiSelect = ({ label, options, selected, onChange }: MultiSelectProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const toggle = (val: string) => {
        onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
    };

    const remove = (e: React.MouseEvent, val: string) => {
        e.stopPropagation();
        onChange(selected.filter((v) => v !== val));
    };

    const selectedOptions = options.filter((o) => selected.includes(o.value));

    const getBadgeBg = (opt: MultiSelectOption) => {
        if (opt.type === "priority") return priorityColors[opt.value]?.bg ?? "bg-gray-100";
        if (opt.type === "status") return statusColors[opt.value] ?? "bg-gray-100";
        return "bg-gray-100";
    };

    const getDot = (opt: MultiSelectOption) => {
        if (opt.type === "priority") return priorityColors[opt.value]?.markBg ?? null;
        return null;
    };

    return (
        <div ref={ref} className="relative w-full sm:w-auto">
            <div
                onClick={() => setOpen((p) => !p)}
                className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2.5 py-1.5 cursor-pointer bg-white hover:bg-gray-50 min-w-28 select-none"
            >
                {selectedOptions.length === 0 ? (
                    <span className="text-sm font-medium text-gray-500">{label}</span>
                ) : (
                    <div className="flex items-center gap-1 flex-wrap">
                        {selectedOptions.map((opt) => {
                            const dot = getDot(opt);
                            return (
                                <span
                                    key={opt.value}
                                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full text-gray-700 ${getBadgeBg(opt)}`}
                                >
                                    {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
                                    {opt.label}
                                    <button onClick={(e) => remove(e, opt.value)} className="hover:opacity-60 ml-0.5">
                                        <X size={10} />
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                )}
                <ChevronDown
                    size={13}
                    className={`text-gray-400 ml-auto shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </div>

            {open && (
                <ul className="absolute z-50 mt-1 min-w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden py-1">
                    {options.map((opt) => {
                        const isSelected = selected.includes(opt.value);
                        const dot = getDot(opt);
                        return (
                            <li
                                key={opt.value}
                                onClick={() => toggle(opt.value)}
                                className={`flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${isSelected ? "bg-gray-50" : ""}`}
                            >
                                <span
                                    className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"
                                        }`}
                                >
                                    {isSelected && (
                                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </span>
                                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full text-gray-700 ${getBadgeBg(opt)}`}>
                                    {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
                                    {opt.label}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

// ── DateRangePicker ───────────────────────────────────────────────────────────

type DateRangeProps = {
    from: string;
    to: string;
    onChange: (from: string, to: string) => void;
};

const DateRangePicker = ({ from, to, onChange }: DateRangeProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const fmt = (d: string) => (d ? dayjs(d).format("MMM D") : "");

    return (
        <div ref={ref} className="relative w-full sm:w-auto">
            <div
                onClick={() => setOpen((p) => !p)}
                className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer bg-white hover:bg-gray-50 select-none"
            >
                <CalendarDays size={13} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                    {from && to ? `${fmt(from)} – ${fmt(to)}` : "Pick dates"}
                </span>
            </div>

            {open && (
                <div className="absolute z-50 mt-1 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-56">
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">From</label>
                            <input
                                type="date"
                                value={from}
                                max={to || undefined}
                                onChange={(e) => onChange(e.target.value, to)}
                                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">To</label>
                            <input
                                type="date"
                                value={to}
                                min={from || undefined}
                                onChange={(e) => onChange(from, e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ── options ───────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: MultiSelectOption[] = [
    { value: "todo", label: "To Do", type: "status" },
    { value: "inprogress", label: "In Progress", type: "status" },
    { value: "inreview", label: "In Review", type: "status" },
    { value: "done", label: "Done", type: "status" },
];

const PRIORITY_OPTIONS: MultiSelectOption[] = [
    { value: "critical", label: "Critical", type: "priority" },
    { value: "high", label: "High", type: "priority" },
    { value: "medium", label: "Medium", type: "priority" },
    { value: "low", label: "Low", type: "priority" },
];

const ASSIGNEE_OPTIONS: SelectOption[] = [
    { value: "", label: "Assignee" },
    { value: "sl", label: "SL" },
    { value: "jd", label: "JD" },
    { value: "mk", label: "MK" },
    { value: "ar", label: "AR" },
];

// ── FilterBar ─────────────────────────────────────────────────────────────────


export default function FilterBar({ filters, setFilters }: { filters: Filters; setFilters: React.Dispatch<React.SetStateAction<Filters>> }) {
    



    const hasActive =
        filters.status.length > 0 ||
        filters.priority.length > 0 ||
        filters.assignee !== "" ||
        filters.dateFrom !== "" ||
        filters.dateTo !== "";

    const clearAll = () =>
        setFilters({ status: [], priority: [], assignee: "", dateFrom: "", dateTo: "" });

    useEffect(() => {
        const params = new URLSearchParams()

        Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => params.append(key, v))
            } else if (value) {
                params.set(key, value)
            }
        })

        const newUrl = `?${params.toString()}`

        // avoid unnecessary history entries
        if (window.location.search !== newUrl) {
            window.history.replaceState({}, "", newUrl)
        }
    }, [filters])

    return (
        <div className="flex w-full flex-wrap items-stretch gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm xl:ml-auto xl:w-auto xl:justify-end">
            <MultiSelect
                label="Status"
                options={STATUS_OPTIONS}
                selected={filters.status}
                onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
            />

            <MultiSelect
                label="Priority"
                options={PRIORITY_OPTIONS}
                selected={filters.priority}
                onChange={(v) => setFilters((f) => ({ ...f, priority: v }))}
            />

            <Select
                options={ASSIGNEE_OPTIONS}
                value={filters.assignee}
                onChange={(e) => setFilters((f) => ({ ...f, assignee: e.target.value }))}
            />

            <DateRangePicker
                from={filters.dateFrom}
                to={filters.dateTo}
                onChange={(from, to) => setFilters((f) => ({ ...f, dateFrom: from, dateTo: to }))}
            />

            {hasActive && (
                <button
                    onClick={clearAll}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                    Clear all filters
                </button>
            )}
        </div>
    );
}
