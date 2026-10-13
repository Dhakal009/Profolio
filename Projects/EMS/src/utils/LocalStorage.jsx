const employees = [
  {
    id: 1,
    name: "Bikash",
    email: "bikashdhakal546@gmail.com",
    password: "123",

    taskCount: {
      total: 4,
      active: 2,
      newTask: 1,
      completed: 1,
      failed: 1
    },

    tasks: [
      {
        active: true,
        newTask: true,
        completed: false,
        failed: false,
        taskTitle: "Complete Website Homepage",
        taskDescription: "Design and implement the homepage for the company website.",
        taskDate: "2026-09-04",
        category: "Development"
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        taskTitle: "Fix Login Bug",
        taskDescription: "Find and fix the authentication issue in the employee login system.",
        taskDate: "2026-09-05",
        category: "Bug Fix"
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        taskTitle: "Database Setup",
        taskDescription: "Create the initial database structure for the project.",
        taskDate: "2026-09-02",
        category: "Database"
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        taskTitle: "Prepare API Documentation",
        taskDescription: "Document all available REST API endpoints.",
        taskDate: "2026-09-01",
        category: "Documentation"
      }
    ]
  },

  {
    id: 2,
    name: "Ram",
    email: "ram@example.com",
    password: "123",

    taskCount: {
      total: 3,
      active: 2,
      newTask: 1,
      completed: 1,
      failed: 0
    },

    tasks: [
      {
        active: true,
        newTask: true,
        completed: false,
        failed: false,
        taskTitle: "Prepare Sales Report",
        taskDescription: "Prepare the weekly sales report and submit it to the manager.",
        taskDate: "2026-09-04",
        category: "Report"
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        taskTitle: "Contact Clients",
        taskDescription: "Contact existing clients and collect their feedback.",
        taskDate: "2026-09-05",
        category: "Client Management"
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        taskTitle: "Update Customer List",
        taskDescription: "Update customer information in the company database.",
        taskDate: "2026-09-02",
        category: "Data Entry"
      }
    ]
  },

  {
    id: 3,
    name: "Shyam",
    email: "shyam@example.com",
    password: "123",

    taskCount: {
      total: 4,
      active: 2 ,
      newTask: 1,
      completed: 1,
      failed: 1
    },

    tasks: [
      {
        active: true,
        newTask: true,
        completed: false,
        failed: false,
        taskTitle: "Test New Feature",
        taskDescription: "Test the newly developed notification feature.",
        taskDate: "2026-09-04",
        category: "Testing"
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        taskTitle: "Find UI Issues",
        taskDescription: "Check the application for layout and usability issues.",
        taskDate: "2026-09-05",
        category: "Quality Assurance"
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        taskTitle: "Write Test Cases",
        taskDescription: "Create test cases for the employee management module.",
        taskDate: "2026-09-01",
        category: "Testing"
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        taskTitle: "Mobile Testing",
        taskDescription: "Test the application on different mobile screen sizes.",
        taskDate: "2026-08-30",
        category: "Testing"
      }
    ]
  },

  {
    id: 4,
    name: "Sita",
    email: "sita@example.com",
    password: "123",

    taskCount: {
      total: 3,
      active: 2,
      newTask: 1,
      completed: 1,
      failed: 0
    },

    tasks: [
      {
        active: true,
        newTask: true,
        completed: false,
        failed: false,
        taskTitle: "Design Dashboard",
        taskDescription: "Create a clean and responsive dashboard design.",
        taskDate: "2026-09-04",
        category: "Design"
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        taskTitle: "Create User Interface",
        taskDescription: "Design the user interface for the employee management page.",
        taskDate: "2026-09-06",
        category: "UI/UX"
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        taskTitle: "Create Login Design",
        taskDescription: "Design the login and registration screens.",
        taskDate: "2026-09-02",
        category: "Design"
      }
    ]
  },

  {
    id: 5,
    name: "Hari",
    email: "hari@example.com",
    password: "123",

    taskCount: {
      total: 4,
      active: 2,
      newTask: 1,
      completed: 1,
      failed: 1
    },

    tasks: [
      {
        active: true,
        newTask: true,
        completed: false,
        failed: false,
        taskTitle: "Deploy Application",
        taskDescription: "Deploy the latest version of the application to the server.",
        taskDate: "2026-09-04",
        category: "Deployment"
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        taskTitle: "Server Monitoring",
        taskDescription: "Monitor server performance and check for errors.",
        taskDate: "2026-09-05",
        category: "DevOps"
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        taskTitle: "Configure Server",
        taskDescription: "Configure the development server and required dependencies.",
        taskDate: "2026-09-01",
        category: "DevOps"
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        taskTitle: "Backup Database",
        taskDescription: "Create a backup of the production database.",
        taskDate: "2026-08-31",
        category: "Database"
      }
    ]
  }
];

const admin = [
  {
    id: 1,
    name: "Admin",
    email: "admin@me.com",
    password: "123"
  }
];


export const setLocalStorage = () => {
  localStorage.setItem('employees',JSON.stringify(employees))
  localStorage.setItem('admin',JSON.stringify(admin))
}
export const getLocalStorage = () => {
  const employeesRaw = localStorage.getItem('employees')
  const adminRaw = localStorage.getItem('admin')

  // If not seeded yet, seed and return defaults
  if (!employeesRaw || !adminRaw) {
    setLocalStorage()
    return { employees, admin }
  }

  try {
    const employeesParsed = JSON.parse(employeesRaw)
    const adminParsed = JSON.parse(adminRaw)
    return { employees: employeesParsed, admin: adminParsed }
  } catch (err) {
    // If parsing fails, re-seed defaults
    setLocalStorage()
    return { employees, admin }
  }

}