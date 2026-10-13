
import React from 'react'
import Header from '../others/Header'
import AllTask from '../others/AllTask'
import CreateTask from '../others/CreateTask'

function AdminDashboard(props) {
  return (
    <div className="min-h-screen w-full bg-[#0b0f0e] px-5 py-5 text-white md:px-8">
      
      <Header changeUser={props.changeUser} data = {props.data} />

      < CreateTask />

        {/* Tasks */}
        <div className="mt-8">
          <AllTask />
        </div>

    </div>
  )
}

export default AdminDashboard

