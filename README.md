# ToDoList Timer

* Pomodoro timer to help people stay on task


# How to run todo list
  * install webpack
  * npm start within the directory where the webpack.config is

# How to run Go Server
  * install Go
  * in backend folder run 'go run main.go'
  * Now the backend can communicate with the server

# Ports
  * Had to use github.com/rs/cors so that we can use two different ports on the same localMachine for the front and backend
  * Go server on port 8081
  * Webpack on 8080


![Todolist](./src/components/image.png)

# REST API

Explanation: The REST API currently has two endpoints that do the following tasks "Create & List" tasks. One creates tasks and one lists all the tasks, later I will implement delete and editing

# First End-Point:
Request Type: POST
URL: http://localhost:8080/createTask
JSON DATA: { "title":"Clean the bathroom", "status": "uncomplete" }

# Instructions: Send a POST Request to the "URL" with simlar JSON Data, must  contain a title you want to name the task, and a status such as "uncomplete" or "inprogress"

# Second End-Point:
Request Type: GET
URL: http://localhost:8080/getTasks

# Instructions: Send a GET request to the "URL" and it will return all created tasks in the following way. It is an JSON Array.

Returned Data: [{"id":"655d349bd0d52073c93b5524","title":"Clean the bathroom","status":"uncomplete","createdAt":"2023-11-21T22:52:11.641Z"},{"id":"655d3584d0d52073c93b5525","title":"Clean the garage","status":"uncomplete","createdAt":"2023-11-21T22:56:04.703Z"}]

# DELETE:
curl -X DELETE "http://localhost:8080/deleteTask?id=TaskIDHere"


# UPDATE: 
curl -X PUT "http://localhost:8080/updateTask" \
     -H "Content-Type: application/json" \
     -d '{
         "id": "TaskIDHere",
         "title": "Updated Task Title",
         "status": "Updated Status"
         }
