
import React from 'react'

function Header(props) {

  const userName = props.data ? props.data.name : 'Admin'

  const logOutUser = () => {
    localStorage.removeItem('loggedInUser')
    props.changeUser('')
  }

  return (
    <div className="flex items-center justify-between">

      {/* User Info */}
      <div>
        <p className="text-sm text-gray-400 mb-1">
          Welcome back,
        </p>

        <h1 className="text-3xl font-semibold text-white">
          {userName} <span>👋</span>
        </h1>
      </div>

      {/* Logout */}
      <button
        onClick={logOutUser}
        className="px-5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-medium text-sm hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
      >
        Logout
      </button>

    </div>
  )
}

export default Header

