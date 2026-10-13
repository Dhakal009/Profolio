import React,{useContext, useState} from 'react'
import { AuthContext } from '../../context/AuthProvider';

function CreateTask() {

    const auth = useContext(AuthContext)
    const userData = { employees: auth?.employees ?? [], admin: auth?.admin }
    const setUserData = auth?.setUserData

    const [taskTitle, setTaskTitle] = useState('');
    const [taskDate, setDate] = useState('');
    const [assignTo, setAssignTo] = useState('');
    const [category, setCategory] = useState('');
    const [taskDescription, setDescription] = useState('');


    const submitHandler = (e)=>{
        e.preventDefault();


        const newTask = {
          id: Date.now(),
          active:false,
          newTask:true,
          completed:false,
          failed:false,
          taskTitle,
          taskDescription,
          taskDate,
          category,
        }

        const data = userData.employees.map((e) => {
          if (assignTo.trim().toLowerCase() === e.name.toLowerCase()){
            return {
              ...e,
              tasks: [...(e.tasks || []), newTask],
              taskCount: {
                ...e.taskCount,
                total: (e.taskCount?.total ?? 0) + 1,
                newTask: (e.taskCount?.newTask ?? 0) + 1
              }
            }
          }
          return e
        })

        setUserData({
          ...userData,
          employees: data
        })

        clearForm()
    }

    const clearForm = ()=>{
        setTaskTitle('')
        setDate('')
        setAssignTo('')
        setCategory('')
        setDescription('')
    }

  return (
      <div className="mx-auto mt-7 max-w-7xl">
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111615] shadow-2xl shadow-black/20">
          
          {/* Header */}
          <div className="border-b border-white[0.06] px-6 py-5 md:px-8">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white">
                Create New Task
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Assign a task to an employee and add the required details.
              </p>
            </div>
          </div>

          {/* Form */}
          <form  onSubmit={(e)=>{
            submitHandler(e)
          }} 
          className="flex flex-col gap-8 p-6 md:flex-row md:p-8 h-100 ">

            {/* Left Side */}
            <div className="w-full md:w-1/2">

              {/* Task Title */}
              <div className="mb-5">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Task Title
                </label>

                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e)=> setTaskTitle(e.target.value)}
                  placeholder="e.g. Make UI design"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0c1110] px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-200 hover:border-white/[0.13] focus:border-emerald-400/50 focus:bg-[#0e1412] focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>

              {/* Date */}
              <div className="mb-5">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Date
                </label>

                <input
                  value={taskDate}
                  onChange={(e)=> setDate(e.target.value)}
                  type="date"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0c1110] px-4 py-3.5 text-sm text-gray-300 outline-none transition-all duration-200 hover:border-white/[0.13] focus:border-emerald-400/50 focus:bg-[#0e1412] focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>

              {/* Assign To */}
              <div className="mb-5">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Assign To
                </label>

                <input
                  type="text"
                  value={assignTo}
                  onChange={(e)=> setAssignTo(e.target.value)}
                  placeholder="Employee name"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0c1110] px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-200 hover:border-white/[0.13] focus:border-emerald-400/50 focus:bg-[#0e1412] focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Category
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(e)=> setCategory(e.target.value) }
                  placeholder="e.g. Design, Development"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0c1110] px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-200 hover:border-white/[0.13] focus:border-emerald-400/50 focus:bg-[#0e1412] focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>

            </div>

            {/* Right Side */}
            <div className="flex w-full flex-col md:w-1/2">

              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                Description
              </label>

              <textarea
                value={taskDescription}
                onChange={(e)=> setDescription(e.target.value)}
                placeholder="Add a short description..."
                className="min-h-55 w-full resize-none rounded-xl border border-white/8 bg-[#0c1110] px-4 py-3.5 text-sm leading-6 text-white placeholder:text-gray-600 outline-none transition-all duration-200 hover:border-white/[0.13] focus:border-emerald-400/50 focus:bg-[#0e1412] focus:ring-2 focus:ring-emerald-400/10"
              />

              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-semibold text-[#07100d] transition-all duration-200 hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-400/10 active:scale-[0.99]"
              >
                Create Task
              </button>

            </div>

          </form>
        </div>
      </div>
  )
}

export default CreateTask;