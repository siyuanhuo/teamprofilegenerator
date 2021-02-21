const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");



// ========================Helper Functions==========================
// these functions ask for employee info and generate curresponding object
async function employeeInfo() {
  let employee = await inquirer.prompt([
    {name: 'name', message: 'What is the emolpyee\'s name?'},
    {name: 'id', message: 'What is the employee\'s id?'},
    {name: 'email', message: 'What is the employee\'s Email?'}
  ])

  return employee
}

async function managerInfo() {
  let employee = await employeeInfo()
  let manager = await inquirer.prompt([
    {name: 'officeNumber', type: 'number', message: 'What is the office number?'}
  ])
  let result = new Manager(employee.name, employee.id, employee.email, manager.officeNumber)
  return result
}

async function engineerInfo() {
  let employee = await employeeInfo()
  let engineer = await inquirer.prompt([
    {name: 'github', message: 'What is the Github username?'}
  ])
  let result = new Engineer(employee.name, employee.id, employee.email, engineer.github)
  return result
}

async function internInfo() {
  let employee = await employeeInfo()
  let intern = await inquirer.prompt([
    {name: 'school', message: 'What is the School?'}
  ])
  let result = new Intern(employee.name, employee.id, employee.email, intern.school)
  return result
}
// ==================================================================


async function main() {
  let employees = []

  // Write code to use inquirer to gather information about the development team members, and to create objects for each team member (using the correct classes as blueprints!)
  let manager = await managerInfo()
  employees.push(manager)
  let nextEmployee = () => {return inquirer.prompt([
    {name: 'next', 
    type: 'list', 
    choices: ['Engineer', 'Intern', 'Done'],
    message: 'Would you like to add another employee?'}
  ])}

  do {
    var next = await nextEmployee()
    if(next.next === 'Engineer') {
      let engineer = await engineerInfo()
      employees.push(engineer)
    } else if (next.next === 'Intern') {
      let intern = await internInfo()
      employees.push(intern)
    }
  } while (next.next != 'Done')

  // After the user has input all employees desired, call the `render` function (required above) and pass in an array containing all employee objects; the `render` function will generate and return a block of HTML including templated divs for each employee!
  let teamHtml = render(employees)

  // After you have your html, you're now ready to create an HTML file using the HTML returned from the `render` function. Now write it to a file named `team.html` in the `output` folder. You can use the variable `outputPath` above target this location.
  // Hint: you may need to check if the `output` folder exists and create it if it does not.
  if(!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR)
  fs.writeFileSync(outputPath, teamHtml, (err) => {
    if (err) throw err
    else console.log('The file has been saved as ./output/team.html')
  })


}

main()


// HINT: each employee type (manager, engineer, or intern) has slightly different information; write your code to ask different questions via inquirer depending on employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer, and Intern classes should all extend from a class named Employee; see the directions for further information. Be sure to test out each class and verify it generates an object with the correct structure and methods. This structure will be crucial in order for the provided `render` function to work! ```
