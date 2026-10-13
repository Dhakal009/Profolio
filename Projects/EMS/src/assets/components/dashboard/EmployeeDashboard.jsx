
import React from 'react'
import Header from '../others/Header'
import TaskListNumber from '../others/TaskListNumber'
import TaskList from '../taskList/TaskList'

function EmployeeDashboard(props) {
  if (!props.data) {
    return (
      <div className="min-h-screen w-full bg-[#0b0f0e] px-5 py-5 text-white md:px-8 flex items-center justify-center">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#0b0f0e] px-5 py-5 text-white md:px-8">

      <Header  changeUser = {props.changeUser} data = {props.data} />

      <main className="mx-auto max-w-7xl">

        {/* Task Statistics */}
        <section className="mt-7">
          <TaskListNumber data={props.data} />
        </section>

        {/* Task List */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight text-white">
              My Tasks
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View and manage your assigned tasks.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#111615] p-5 shadow-2xl shadow-black/20 md:p-6">
            <TaskList  data={props.data}/>
          </div>
        </section>

      </main>

    </div>
  )
}

export default EmployeeDashboard

