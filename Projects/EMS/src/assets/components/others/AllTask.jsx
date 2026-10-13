import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'

function AllTask() {

  const authData = useContext(AuthContext)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  // Show selected employee details
  if (selectedEmployee) {
    return (
      <div className="bg-[#1C1C1C] border border-white/10 p-5 rounded-xl mt-5  max-w-7xl ml-22">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-gray-500 text-sm">
              Employee Details
            </p>

            <h2 className="text-2xl font-semibold text-white">
              {selectedEmployee.name}
            </h2>
          </div>

          <button
            onClick={() => setSelectedEmployee(null)}
            className="bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition cursor-pointer"
          >
            Back
          </button>
        </div>

        {/* Tasks */}
        <div className="space-y-2">
          {(selectedEmployee.tasks || []).map((task) => {
            return (
              <div
                key={task.id}
                className="bg-[#242424] border border-white/5 p-4 rounded-lg"
              >
                <h3 className="text-white font-semibold">
                  {task.taskTitle}
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                  {task.taskDescription}
                </p>

                <div className="flex gap-6 mt-3 text-sm">
                  <p className="text-gray-500">
                    Date: <span className="text-gray-300">{task.taskDate}</span>
                  </p>

                  <p className="text-gray-500">
                    Category: <span className="text-gray-300">{task.category}</span>
                  </p>
                </div>

                <div className="flex gap-4 mt-3 text-xs">
                  {task.active && (
                    <span className="text-blue-400">Active</span>
                  )}

                  {task.newTask && (
                    <span className="text-red-400">New Task</span>
                  )}

                  {task.completed && (
                    <span className="text-emerald-400">Completed</span>
                  )}

                  {task.failed && (
                    <span className="text-yellow-400">Failed</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    )
  }

  // Employee list
  return (
    <div
      id="alltask"
      className="bg-[#1C1C1C] border border-white/10 p-5 h-57 rounded-xl mt-5 max-w-7xl ml-22"
    >

      {/* Table Header */}
      <div className="bg-[#242424] border border-white/10 mb-2 py-3 px-4 rounded-lg flex justify-between items-center">
        <h2 className="text-gray-300 text-sm font-semibold w-1/5">
          Employee Name
        </h2>

        <h3 className="text-gray-300 text-sm font-semibold w-1/5">
          New Task
        </h3>

        <h5 className="text-gray-300 text-sm font-semibold w-1/5">
          Active Task
        </h5>

        <h5 className="text-gray-300 text-sm font-semibold w-1/5">
          Completed
        </h5>

        <h5 className="text-gray-300 text-sm font-semibold w-1/5">
          Failed
        </h5>
      </div>

      {/* Employee Task List */}
      <div
        id="employeeTaskList"
        className="h-[80%] overflow-auto pr-1"
      >
        {(authData.employees || []).map((e) => {
          return (
            <button
              key={e.id}
              onClick={() => setSelectedEmployee(e)}
              className="w-full bg-[#242424] border border-white/5 mb-2 py-3 px-4 rounded-lg flex justify-between items-center text-left hover:bg-[#2a2a2a] hover:border-white/10 transition-all duration-200 cursor-pointer"
            >

              <h2 className="text-white text-sm font-medium w-1/5">
                {e.name}
              </h2>

              <h3 className="text-red-400 text-sm font-semibold w-1/5">
                {e.taskCount.newTask}
              </h3>

              <h5 className="text-blue-400 text-sm font-semibold w-1/5">
                {e.taskCount.active}
              </h5>

              <h5 className="text-emerald-400 text-sm font-semibold w-1/5">
                {e.taskCount.completed}
              </h5>

              <h5 className="text-yellow-400 text-sm font-semibold w-1/5">
                {e.taskCount.failed}
              </h5>

            </button>
          )
        })}
      </div>

    </div>
  )
}

export default AllTask