import { useState, useEffect } from 'react';
import { getLocalStorage } from '../../../Projects/EMS/src/utils/LocalStorage.jsx';

const STORAGE_KEY_USER = 'ems_demo_loggedInUser';

export default function EmsDemo() {
  const [userData, setUserData] = useState(() => getLocalStorage());
  const [userRole, setUserRole] = useState(null);
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  // Admin CreateTask form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [category, setCategory] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskFeedback, setTaskFeedback] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserRole(parsed.role);
        if (parsed.employeeId) {
          setLoggedInEmployeeId(parsed.employeeId);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    }
  }, []);

  const syncEmployees = (updatedEmployees) => {
    const next = { ...userData, employees: updatedEmployees };
    setUserData(next);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  const handleLogin = (loginEmail, loginPassword) => {
    setErrorMsg('');
    const trimmedEmail = loginEmail.trim().toLowerCase();
    if (trimmedEmail === 'admin@me.com' && loginPassword === '123') {
      setUserRole('admin');
      setLoggedInEmployeeId(null);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify({ role: 'admin' }));
      return;
    }

    const emp = (userData?.employees || []).find(
      (e) => e.email.toLowerCase() === trimmedEmail && e.password === loginPassword
    );
    if (emp) {
      setUserRole('employee');
      setLoggedInEmployeeId(emp.id);
      localStorage.setItem(
        STORAGE_KEY_USER,
        JSON.stringify({ role: 'employee', employeeId: emp.id })
      );
      return;
    }

    setErrorMsg('Invalid credentials. Use the quick-fill buttons below or check email/password.');
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY_USER);
    setUserRole(null);
    setLoggedInEmployeeId(null);
    setSelectedEmployeeId(null);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !assignTo.trim()) {
      setTaskFeedback('Please provide at least a Task Title and Employee Name.');
      return;
    }

    const matched = (userData.employees || []).some(
      (emp) => emp.name.toLowerCase() === assignTo.trim().toLowerCase()
    );
    if (!matched) {
      setTaskFeedback(
        `Employee "${assignTo}" not found. Available: ${userData.employees.map((x) => x.name).join(', ')}`
      );
      return;
    }

    const newTask = {
      id: Date.now(),
      active: false,
      newTask: true,
      completed: false,
      failed: false,
      taskTitle: taskTitle.trim(),
      taskDescription: taskDescription.trim() || 'Assigned via Admin Dashboard.',
      taskDate: taskDate || new Date().toISOString().slice(0, 10),
      category: category.trim() || 'General',
    };

    const updated = userData.employees.map((emp) => {
      if (emp.name.toLowerCase() === assignTo.trim().toLowerCase()) {
        return {
          ...emp,
          tasks: [newTask, ...(emp.tasks || [])],
          taskCount: {
            ...emp.taskCount,
            total: (emp.taskCount?.total ?? 0) + 1,
            newTask: (emp.taskCount?.newTask ?? 0) + 1,
          },
        };
      }
      return emp;
    });

    syncEmployees(updated);
    setTaskTitle('');
    setTaskDate('');
    setAssignTo('');
    setCategory('');
    setTaskDescription('');
    setTaskFeedback(`Task "${newTask.taskTitle}" assigned to ${assignTo}!`);
    setTimeout(() => setTaskFeedback(''), 3000);
  };

  const handleTaskStatusChange = (employeeId, taskIndex, action) => {
    const updated = (userData.employees || []).map((emp) => {
      if (emp.id !== employeeId) return emp;

      const tasks = (emp.tasks || []).map((t, idx) => {
        if (idx !== taskIndex) return t;
        if (action === 'accept') {
          return { ...t, newTask: false, active: true, completed: false, failed: false };
        }
        if (action === 'complete') {
          return { ...t, newTask: false, active: false, completed: true, failed: false };
        }
        if (action === 'fail' || action === 'reject') {
          return { ...t, newTask: false, active: false, completed: false, failed: true };
        }
        return t;
      });

      const taskCount = tasks.reduce(
        (acc, t) => {
          acc.total += 1;
          if (t.active) acc.active += 1;
          if (t.newTask) acc.newTask += 1;
          if (t.completed) acc.completed += 1;
          if (t.failed) acc.failed += 1;
          return acc;
        },
        { total: 0, active: 0, newTask: 0, completed: 0, failed: 0 }
      );

      return { ...emp, tasks, taskCount };
    });

    syncEmployees(updated);
  };

  const currentEmployee = (userData?.employees || []).find(
    (e) => e.id === loggedInEmployeeId
  );
  const selectedEmployee = (userData?.employees || []).find(
    (e) => e.id === selectedEmployeeId
  );

  // 1. LOGIN VIEW
  if (!userRole) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#1C1C1C] px-4 py-10 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#242424] p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-gray-400">
              Sign in to continue to your dashboard
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
              {errorMsg}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(email, password);
            }}
            className="flex flex-col"
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-white/10 bg-[#1C1C1C] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-emerald-500/60"
            />

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder="Enter your password"
              className="mt-4 w-full rounded-xl border border-white/10 bg-[#1C1C1C] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-emerald-500/60"
            />

            <button
              type="submit"
              className="mt-6 rounded-xl bg-emerald-500 py-3 px-5 text-sm font-semibold text-white transition hover:bg-emerald-400 cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. ADMIN DASHBOARD VIEW
  if (userRole === 'admin') {
    return (
      <div className="min-h-screen w-full bg-[#0b0f0e] px-5 py-6 text-white md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Welcome back,</p>
              <h1 className="text-3xl font-semibold text-white">
                Admin <span>👋</span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-medium text-sm hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Create Task */}
          <div className="mt-7 overflow-hidden rounded-2xl border border-white/10 bg-[#111615] shadow-2xl">
            <div className="border-b border-white/10 px-6 py-5 md:px-8 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-white">
                  Create New Task
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Assign a task to an employee and add the required details.
                </p>
              </div>
              {taskFeedback && (
                <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-300">
                  {taskFeedback}
                </span>
              )}
            </div>

            <form
              onSubmit={handleCreateTask}
              className="flex flex-col gap-6 p-6 md:flex-row md:p-8"
            >
              <div className="w-full md:w-1/2 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g. Redesign Analytics Widget"
                    className="w-full rounded-xl border border-white/10 bg-[#0c1110] px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-emerald-400/50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Date
                  </label>
                  <input
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    type="date"
                    className="w-full rounded-xl border border-white/10 bg-[#0c1110] px-4 py-3 text-sm text-gray-300 outline-none focus:border-emerald-400/50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Assign To
                  </label>
                  <select
                    value={assignTo}
                    onChange={(e) => setAssignTo(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0c1110] px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
                  >
                    <option value="">Select an employee...</option>
                    {(userData.employees || []).map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name} ({emp.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Design, Development, QA"
                    className="w-full rounded-xl border border-white/10 bg-[#0c1110] px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-emerald-400/50"
                  />
                </div>
              </div>

              <div className="flex w-full flex-col justify-between md:w-1/2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Description
                  </label>
                  <textarea
                    rows={7}
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Add task requirements and acceptance criteria..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#0c1110] px-4 py-3 text-sm leading-6 text-white placeholder:text-gray-600 outline-none focus:border-emerald-400/50"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-5 flex w-full items-center justify-center rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-semibold text-[#07100d] transition hover:bg-emerald-300 cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>

          {/* All Tasks / Selected Employee Detail */}
          <div className="mt-8">
            {selectedEmployee ? (
              <div className="bg-[#1C1C1C] border border-white/10 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">
                      Employee Details
                    </p>
                    <h2 className="text-2xl font-semibold text-white mt-1">
                      {selectedEmployee.name}{' '}
                      <span className="text-sm font-normal text-gray-400">
                        ({selectedEmployee.email})
                      </span>
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedEmployeeId(null)}
                    className="bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition cursor-pointer"
                  >
                    ← Back to All Employees
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {(selectedEmployee.tasks || []).map((task, idx) => (
                    <div
                      key={task.id || idx}
                      className="bg-[#242424] border border-white/10 p-4 rounded-xl"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-gray-300">
                          {task.category}
                        </span>
                        <span className="text-xs text-gray-400">{task.taskDate}</span>
                      </div>
                      <h3 className="text-white font-semibold mt-3">{task.taskTitle}</h3>
                      <p className="text-gray-400 text-sm mt-1">{task.taskDescription}</p>
                      <div className="flex gap-3 mt-3 text-xs font-medium">
                        {task.active && <span className="text-blue-400">● Active</span>}
                        {task.newTask && <span className="text-red-400">● New Task</span>}
                        {task.completed && (
                          <span className="text-emerald-400">● Completed</span>
                        )}
                        {task.failed && <span className="text-yellow-400">● Failed</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#1C1C1C] border border-white/10 p-5 rounded-2xl">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">
                    Workforce Overview (Click any employee to inspect tasks)
                  </h3>
                </div>
                <div className="bg-[#242424] border border-white/10 mb-2 py-3 px-4 rounded-lg grid grid-cols-5 text-xs md:text-sm font-semibold text-gray-300">
                  <span>Employee Name</span>
                  <span>New Task</span>
                  <span>Active Task</span>
                  <span>Completed</span>
                  <span>Failed</span>
                </div>

                <div className="space-y-2">
                  {(userData.employees || []).map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => setSelectedEmployeeId(e.id)}
                      className="w-full bg-[#242424] border border-white/5 py-3 px-4 rounded-lg grid grid-cols-5 items-center text-left hover:bg-[#2a2a2a] hover:border-white/15 transition cursor-pointer"
                    >
                      <span className="text-white text-sm font-medium">{e.name}</span>
                      <span className="text-red-400 text-sm font-semibold">
                        {e.taskCount.newTask}
                      </span>
                      <span className="text-blue-400 text-sm font-semibold">
                        {e.taskCount.active}
                      </span>
                      <span className="text-emerald-400 text-sm font-semibold">
                        {e.taskCount.completed}
                      </span>
                      <span className="text-yellow-400 text-sm font-semibold">
                        {e.taskCount.failed}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. EMPLOYEE DASHBOARD VIEW
  return (
    <div className="min-h-screen w-full bg-[#0b0f0e] px-5 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Welcome back,</p>
            <h1 className="text-3xl font-semibold text-white">
              {currentEmployee?.name || 'Employee'} <span>👋</span>
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-medium text-sm hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Task Statistics */}
        {currentEmployee && (
          <section className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl py-5 px-6 bg-[#2A2020] border border-red-500/20">
              <h2 className="text-3xl font-semibold text-red-400">
                {currentEmployee.taskCount.newTask}
              </h2>
              <h3 className="mt-1 text-sm font-medium text-gray-300">New Task</h3>
            </div>

            <div className="rounded-xl py-5 px-6 bg-[#202A23] border border-emerald-500/20">
              <h2 className="text-3xl font-semibold text-emerald-400">
                {currentEmployee.taskCount.completed}
              </h2>
              <h3 className="mt-1 text-sm font-medium text-gray-300">Completed</h3>
            </div>

            <div className="rounded-xl py-5 px-6 bg-[#20242A] border border-blue-500/20">
              <h2 className="text-3xl font-semibold text-blue-400">
                {currentEmployee.taskCount.active}
              </h2>
              <h3 className="mt-1 text-sm font-medium text-gray-300">Active</h3>
            </div>

            <div className="rounded-xl py-5 px-6 bg-[#2A2720] border border-yellow-500/20">
              <h2 className="text-3xl font-semibold text-yellow-400">
                {currentEmployee.taskCount.failed}
              </h2>
              <h3 className="mt-1 text-sm font-medium text-gray-300">Failed</h3>
            </div>
          </section>
        )}

        {/* Task List */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight text-white">My Tasks</h2>
            <p className="mt-1 text-sm text-gray-400">
              View and manage your assigned tasks. Click the action buttons to update status in real time.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111615] p-5 shadow-2xl md:p-6">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {(currentEmployee?.tasks || []).map((task, idx) => (
                <div
                  key={task.id || idx}
                  className="flex flex-col justify-between bg-[#242424] border border-white/10 rounded-2xl p-5 shadow-md"
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="bg-red-500/15 text-red-400 text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full">
                        {task.category}
                      </span>
                      <span className="text-xs font-medium text-gray-400">
                        {task.taskDate}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-white leading-snug">
                      {task.taskTitle}
                    </h3>

                    <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                      {task.taskDescription}
                    </p>
                  </div>

                  <div>
                    <div className="border-t border-white/10 my-4" />

                    {task.newTask && (
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleTaskStatusChange(currentEmployee.id, idx, 'accept')
                          }
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs py-2.5 px-3 rounded-lg transition cursor-pointer"
                        >
                          Accept Task
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleTaskStatusChange(currentEmployee.id, idx, 'reject')
                          }
                          className="flex-1 bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 font-medium text-xs py-2.5 px-3 rounded-lg transition cursor-pointer"
                        >
                          Reject Task
                        </button>
                      </div>
                    )}

                    {task.active && !task.newTask && (
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleTaskStatusChange(currentEmployee.id, idx, 'complete')
                          }
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs py-2.5 px-3 rounded-lg transition cursor-pointer"
                        >
                          Mark As Completed
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleTaskStatusChange(currentEmployee.id, idx, 'fail')
                          }
                          className="flex-1 bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 font-medium text-xs py-2.5 px-3 rounded-lg transition cursor-pointer"
                        >
                          Mark As Failed
                        </button>
                      </div>
                    )}

                    {task.completed && (
                      <div className="w-full rounded-lg bg-emerald-500/20 border border-emerald-500/30 py-2.5 text-center text-xs font-semibold text-emerald-300">
                        ✓ Completed
                      </div>
                    )}

                    {task.failed && (
                      <div className="w-full rounded-lg bg-red-500/20 border border-red-500/30 py-2.5 text-center text-xs font-semibold text-red-300">
                        ✕ Failed
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
