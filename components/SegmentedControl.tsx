"use client"

import { ReactNode } from "react"

interface Option<T extends string> {
  value: T
  label: string
  icon?: ReactNode
}

interface Props<T extends string> {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}

export default function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className="flex w-full rounded-xl overflow-hidden border border-gray-200">
      {options.map((opt, i) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition
            ${i < options.length - 1 ? "border-r border-gray-200" : ""}
            ${value === opt.value ? "bg-orange-500 text-white" : "bg-white text-gray-500 hover:bg-orange-50"}`}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  )
}
