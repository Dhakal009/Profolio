import React from 'react'
import AcceptTask from './AcceptTask'
import CompleteTask from './CompleteTask'
import NewTask from './NewTask'
import FailTask from './FailTask'

function TaskList({data}) {
  if (!data || !Array.isArray(data.tasks)) {
    return (
      <div id="taskList" className="h-80 flex items-center justify-center w-full py-5 mt-10">
        <p className="text-gray-400">No tasks available</p>
      </div>
    )
  }

  return (
    <div
      id='taskList'
      className="h-80 overflow-x-auto flex items-center justify-start gap-5 flex-nowrap w-full py-5 mt-10"
    >
      {data.tasks.map((e, idx)=>{
        if(e.active) return <AcceptTask key={idx} data={e}/>
        if(e.newTask) return  <NewTask key={idx} data={e}/>
        if(e.completed) return  <CompleteTask key={idx} data={e} />
        if(e.failed)  return <FailTask key={idx} data={e} />
        return null
      })}

    </div>
  )
}

export default TaskList