import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type props = {
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  className?: string;
};

const Select = ({ options, onChange, value, className }: props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const triggerChange = (newValue: string) => {
    const fakeEvent = {
      target: { value: newValue },
    } as React.ChangeEvent<HTMLSelectElement>;

    onChange(fakeEvent);
  };

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="border w-36 font-medium rounded-md px-3 py-1 cursor-pointer bg-white 
        flex justify-between items-center
        focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>{selected?.label}</span>
        <span className="text-gray-500"><ChevronDown size={14}/></span>
      </div>

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg overflow-hidden">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                triggerChange(option.value);
                setOpen(false);
              }}
              className={`
                px-3 py-2 cursor-pointer transition
                hover:bg-slate-100 text-black
                ${value === option.value ? "bg-gray-100 font-medium" : ""}
              `}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;