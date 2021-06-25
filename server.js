// ------------ MY DEPENDENCES ------------
const inquirer = require('inquirer');
const mysql = require('mysql2')
require('dotenv').config();

const cTable = require('console.table');


const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,

  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

});


// ------------ IF SERVER CONNECTS AND THERES AN ERROR STOP ELSE RUN APPLICATION------------
connection.connect((err) => {
  if (err) throw err;
  start();
})


// ------------ START THE APPLICATION ------------
const start = () => {

  inquirer.prompt(
    {
      type: 'list',
      name: 'options',
      message: 'What would you like to do?',
      choices: 
      [
        'View All Employees',
        'View All Employees by Department',
        'View All Employees by Role',
        'View All Departments',
        'View All Roles',
        'Update Employee Role',
        'Add Employee',
        'Add Department',
        'Add Role',
        'Exit',
      ],
  })
  
//------------ ADD SWITCH FUNCTION THAT INITATES ALL FUNCTIONS BASED ON RESPONSE ------------
  .then((response) => {
    switch (response.choices) {
      case 'View All Employees':
        viewEmployees();
        break;
      case 'View All Employees by Department':
        viewEmployeesByDepartment()
        break;
      case 'View All Employees by Role':
        viewEmployeesbyRole()
        break;
      case 'View All Departments':
        viewDepartments()
        break;
      case 'View All Roles':
        viewRoles()
        break;
      case 'Update Employee Role':
        updateEmployeeRole()
        break;
      case 'Add Employee':
        addEmployee()
        break;
      case 'Add Department':
        addDepartment()
        break;
      case 'Add Role':
        addRole()
        break;
      case 'Exit':
        break;
    }
  })
}



// ------------ CREATE 'VIEW EMPLOYEES' FUNCTION ------------
const viewEmployees = () => {
  connection.query("select * from employee"), (err, res) => {
    if (err) throw err;
    console.log(res);
    start();
  }
};


// ------------ CREATE 'VIEW EMPLOYEES BY DEPARTMENT' FUNCTION ------------
const viewEmployeesByDepartment = () => {

//  GET DEPT TABLE FIRST
  connection.query('SELECT * FROM employeesdb.department', (err, queryResponse) => {
    if (err) throw err;

// ASK USER THEN TO SELECT FROM LIST OF DEPTS
//MAP THE OBJECT FROM QUERY RESPONSE TO AVOID HARD CODING AND WILL INCLUDE ANY ADDED DEPTS FROM USER ------> SEE COMMENT '$$$'
    inquirer.prompt(
      {
        type: 'list',
        message: 'View employees by which department?',
        name: 'departmentid',
        choices: queryResponse.map(department => ({ value: department.id, name: department.name })) // $$$
      }
    )
    
    .then((deptChoice) => {
      connection.query(`SELECT employee.id as 'ID', employee.first_name as 'First Name', employee.last_name as 'Last Name', department.name as 'Department' FROM employee LEFT JOIN employeesdb.role on employee.role_id = role.id LEFT JOIN employeesdb.department ON department.id = role.department_id WHERE department.name = ?`, [deptChoice.departmentid], (err, chosenDeptData) => {
        if (err) throw err;
        console.table(chosenDeptData);
      })
    })
    // RESTART APPLICATION WITH INTITIAL PROMPTS
    start();
  });
};


// ------------ CREATE 'VIEW EMPLOYEES BY ROLE' FUNCTION ------------
const viewEmployeesbyRole = () => {

  connection.query('SELECT * FROM employeesdb.role', (err, queryResponse) => {
    if (err) throw err;

    inquirer.prompt(
      {
        type: 'list',
        message: 'View employees by which role?',
        name: 'roleid',
        choices: queryResponse.map(role => ({ value: role.id, name: role.title })),
      })

      .then((roleChoice) => {
        connection.query(`SELECT employee.id as 'ID', employee.first_name as 'First Name', employee.last_name as 'Last Name', role.title as 'Title', role.salary as 'Salary' FROM employee LEFT JOIN employeesdb.role ON employee.role_id = role.id WHERE role.title = ?`, [roleChoice.roleid], (err, chosenRoleData) => {
          if (err) throw err;
          console.table(chosenRoleData);
        })
      })
      start();
   });
}


// ------------ CREATE 'VIEW DEPARTMENTS' FUNCTION ------------
const viewDepartments = () => {

  connection.query('SELECT * FROM employeesdb.department', (err, res) => {
    if (err) throw err;
    console.table(res);
  })
};


// ------------ CREATE 'VIEW ROLES' FUNCTION ------------
const viewRoles = () => {

  connection.query('SELECT * FROM employeesdb.role', (err, res) => {
    if (err) throw err;
    console.table(res);
  })
}


// ------------ CREATE 'UPDATE EMPLOYEE ROLE' FUNCTION ------------
const updateEmployeeRole = () => {
  connection.query(`SELECT * FROM employee`, (err, employeeTable) => {
    if (err) throw err;

    inquirer.prompt(
      {
        type: 'list',
        message: 'Which employees role is getting changed?',
        name: 'employeeid',
        choices: employeeTable.map(employee => ({name: employee.first_name + " " + employee.last_name, value: employee.id }))
      }
    )

    .then((chosenEmployee) => {

      connection.query(`SELECT * FROM role`, (err, roleTable) => {
        if (err) throw err;

        inquirer.prompt(
          {
            type:'list',
            message: 'What is the title of the new role?',
            name: 'roleid',
            choices: roleTable.map(role => ({ name: role.title, value: role.id}))
          }
        )

        .then((updatedRole) => {
          connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [updatedRole.role_id, chosenEmployee.id], (err, employeesNewRole) => {
            if (err) throw err;
            console.table(employeesNewRole)
          })
        })

      })
    })
  })
  start();
};


// ------------ CREATE 'ADD EMPLOYEE' FUNCTION ------------
const addEmployee = () => {
  connection.query('SELECT * FROM employeesdb.role', (err, queryResponse) => {
    if (err) throw err;

    inquirer.prompt(
      [
        {
          type: 'list',
          message: "Select the employee's role.",
          name: 'roleid',
          choices: queryResponse.map(role =>({ name: role.title, value: role.id})),
        },
        {
          type: 'input',
          message: "What is the employee's first name?",
          name: "firstName",
        },
        {
          type: 'input',
          message: "What is the employee's last name?",
          name: 'lastName',
        },
      ])
  
    .then((response) => {
      connection.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?); SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name' FROM employee` [response.firstName, response.lastName, response.roleid], (err, addedEmployeeData) => {
        if (err) throw err;
        console.table(addedEmployeeData);
      })
    })
  })
  start();
};


// ------------ CREATE 'ADD DEPARTMENT' FUNCTION ------------
const addDepartment = () => {
  inquirer.prompt(
    {
      type: 'input',
      message: 'What is the name of the department?',
      name: 'name',
    }
  )
  .then((addedDepartmentData) => {
    connection.query(`INSERT INTO department (name) VALUES (?)`, [addedDepartmentData.name], (err, newDepartment) => {
      if (err) throw err;
      console.table(newDepartment);
    })
  })
  start();
};


// ------------ CREATE 'ADD ROLE' FUNCTION ------------
const addRole = () => {
  connection.query(`SELECT * FROM department`, (err, departmentTable) => {
    if (err) throw err;
    
    inquirer.prompt(
      [
        {
          type: 'input',
          message: 'What is the title of the role?',
          name: 'title',
        },
        {
          type: 'number',
          message: 'What is the salary of this role?',
          name: 'salary',
        },
        {
          type: 'list',
          message: 'What department does this role belong to?',
          name: 'departmentid',
          choices: departmentTable.map(department => ({name: department.name, value: department.id})),
        }
      ]
    )
    .then((addedRole) => {
      connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?); SELECT title as 'Title', salary as 'Salary', department_id as 'Department'`, [addedRole.title, addedRole.salary, addedRole.department_id], (err, roleTable) => {
        if (err) throw err;
        console.table(roleTable);
      })
    })
  })
  start();
};
