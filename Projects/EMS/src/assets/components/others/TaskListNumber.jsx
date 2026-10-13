
import React from 'react'

function TaskListNumber({ data }) {
  if (!data || !data.taskCount) {
    return (
      <div className="flex mt-10 justify-between gap-5 w-full">
        <div className="w-full text-center py-6">
          <p className="text-gray-400">No task stats available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex mt-10 justify-between gap-5 w-full">

      {/* New Task */}
      <div className="w-[25%] rounded-xl py-5 px-7 bg-[#2A2020] border border-red-500/20">
        <h2 className="text-3xl font-semibold text-red-400">
          {data.taskCount.newTask}
        </h2>
        <h3 className="mt-1 text-base font-medium text-gray-300">
          New Task
        </h3>
      </div>

      {/* Completed */}
      <div className="w-[25%] rounded-xl py-5 px-7 bg-[#202A23] border border-emerald-500/20">
        <h2 className="text-3xl font-semibold text-emerald-400">
          {data.taskCount.completed}
        </h2>
        <h3 className="mt-1 text-base font-medium text-gray-300">
          Completed
        </h3>
      </div>

      {/* Active */}
      <div className="w-[25%] rounded-xl py-5 px-7 bg-[#20242A] border border-blue-500/20">
        <h2 className="text-3xl font-semibold text-blue-400">
          {data.taskCount.active}
        </h2>
        <h3 className="mt-1 text-base font-medium text-gray-300">
          Active
        </h3>
      </div>

      {/* Failed */}
      <div className="w-[25%] rounded-xl py-5 px-7 bg-[#2A2720] border border-yellow-500/20">
        <h2 className="text-3xl font-semibold text-yellow-400">
          {data.taskCount.failed}
        </h2>
        <h3 className="mt-1 text-base font-medium text-gray-300">
          Failed
        </h3>
      </div>

    </div>
  )
}

export default TaskListNumber

