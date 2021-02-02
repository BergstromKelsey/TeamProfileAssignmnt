// create the team
const inquirer = require("inquirer");
const fs = require("fs");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");


const employees = [];

function initApp() {
    makeHtml();
    addEmployee();
}

function addEmployee() {
    inquirer.prompt([{
        message: "Enter name",
        name: "name"
    },
    {
        type: "list",
        message: "Select role",
        choices: [
            "Engineer",
            "Intern",
            "Manager"
        ],
        name: "role"
    },
    {
        message: "Enter ID",
        name: "id"
    },
    {
        message: "Enter Email address",
        name: "email"
    }])
    .then(function({name, role, id, email}) {
        let roleQuestions = "";
        if (role === "Engineer") {
            roleQuestions = "GitHub username";
        } else if (role === "Intern") {
            roleQuestions = "Name of school";
        } else {
            roleQuestions = "Phone Number";
        }
        inquirer.prompt([{
            message: `Enter ${roleQuestions}`,
            name: "roleQuestions"
        },
        {
            type: "list",
            message: "Would you like to add another employee?",
            choices: [
                "yes",
                "no"
            ],
            name: "moreEmployees"
        }])
        .then(function({roleQuestions, moreEmployees}) {
            let newMember;
            if (role === "Engineer") {
                newMember = new Engineer(name, id, email, roleQuestions);
            } else if (role === "Intern") {
                newMember = new Intern(name, id, email, roleQuestions);
            } else {
                newMember = new Manager(name, id, email, roleQuestions);
            }
            employees.push(newMember);
            addHtml(newMember)
            .then(function() {
                if (moreEmployees === "yes") {
                    addEmployee();
                } else {
                    finishedHtml();
                }
            });
            
        });
    });
}       

function makeHtml() {
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=News+Cycle&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <title>Team Profile</title>
    </head>
    <style>
    body {background-color: powderblue; font-family: 'News Cycle', sans-serif;}
    h2   {color:black}
    nav   {background-color:gray;}
    .container {background-color:white;}
    .card {border: solid , gray;}
    </style>
    
    <body>
        <nav class="navbar navbar">
            <span class="navbar-brand"><h1>TEAM PROFILE</h1>All your employee information in one simple, organized place.
            </span>
        </nav>
        <div class="container">
            <div class="row">`;
    fs.writeFile("./dist/team.html", html, function(err) {
        if (err) {
            console.log(err);
        }
    });
    console.log("start");
}

function addHtml(member) {
    return new Promise(function(resolve, reject) {
        const name = member.getName();
        const role = member.getRole();
        const id = member.getId();
        const email = member.getEmail();
        let data = "";
        if (role === "Engineer") {
            const gitHub = member.getGithub();
            data = `<div class="col-6">
            <div class="card mx-auto mb-3" style="width: 18rem">
            <BR><center>
            <class="card-header"><h2><u>${name}</u></h2>
            <br><h5>Engineer</h5></class></center>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><b><u>ID:</b></u> ${id}</li>
                <li class="list-group-item"><b><u>Email Address:</b></u> ${email}</li>
                <li class="list-group-item"><b><u>GitHub: </b></u>${gitHub}</li>
            </ul>
            </div>
        </div>`;
        } else if (role === "Intern") {
            const school = member.getSchool();
            data = `<div class="col-6">
            <div class="card mx-auto mb-3" style="width: 18rem">
            <BR><center>
            <class="card-header"><h2><u>${name}</u></h2>
            <br><h5>Intern</h5></class></center>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><b><u>ID:</b></u> ${id}</li>
                <li class="list-group-item"><b><u>Email Address:</b></u> ${email}</li>
                <li class="list-group-item"><b><u>School:</b></u> ${school}</li>
            </ul>
            </div>
        </div>`;
        } else {
            const phone = member.getOfficeNumber();
            data = `<div class="col-6">
            <div class="card mx-auto mb-3" style="width: 18rem">
            <BR><center>
            <class="card-header"><h2><u>${name}</u></h2>
            <br><h5>Manager</h5></class></center>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><b><u>ID:</b></u> ${id}</li>
                <li class="list-group-item"><b><u>Email Address:</b></u> ${email}</li>
                <li class="list-group-item"><b><u>School:</b></u> ${phone}</li>
            </ul>
            </div>
        </div>`;

        }
        console.log("adding team member");
        fs.appendFile("./dist/team.html", data, function (err) {
            if (err) {
                return reject(err);
            };
            return resolve();
        });
    });  
}

function finishedHtml() {
    const html = ` </div>
    </div>
    
</body>
</html>`;

    fs.appendFile("./dist/team.html", html, function (err) {
        if (err) {
            console.log(err);
        };
    });
    console.log("All finished, your employee list has been generated!");
}

initApp();
