import React from 'react'

function NewTask({ data }) {
  if (!data) return null

  return (
    <div className="shrink-0 h-full w-85 bg-[#242424] border border-white/10 rounded-2xl p-5 shadow-md">

      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="bg-red-500/15 text-red-400 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full">
          {data.category}
        </span>

        <span className="text-xs font-medium text-gray-500">
          {data.taskDate}
        </span>
      </div>

      {/* Title */}
      <h2 className="mt-5 text-xl font-bold text-white leading-snug">
        {data.taskTitle}
      </h2>

      {/* Description */}
      <p className="mt-3 text-sm text-gray-400 leading-relaxed line-clamp-4">
        {data.taskDescription}
      </p>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Divider */}
      <div className="border-t border-white/10 my-5" />

      {/* Actions */}
      <div className="flex gap-3">
        <button
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm py-2.5 px-3 rounded-lg transition-colors duration-200"
        >
          Accept Task
        </button>

        <button
          className="flex-1 bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 font-medium text-sm py-2.5 px-3 rounded-lg transition-colors duration-200"
        >
          Reject Task
        </button>
      </div>

    </div>
  )
}

export default NewTask