const gprc = require("@grpc/grpc-js");
const todosProto = gprc.load("./todo.proto");


const server = gprc.Server();

const todos = [
    {
        id : "1", name : "ritik" , content : "file Ok"
    },
     {
        id : "2", name : "aadi" , content : "file Ok also"
    }
]

server.addService(todosProto.addService.service, {
    ListTodos : (call, callback) => {
        callback(null , todos)

    },
    CreateTodo : (call , callback) => {

        let incomingNewTodo = call.request;
        todos.push(incomingNewTodo);
        callback(null , incomingNewTodo);
    },
    GetTodo : (call , callback)=> {

        let incomingTodoRequest = call.request;
        let todoId = incomingTodoRequest.id;
        let response = todos.filter((todo)=> todo.id === todoId);
        if(response.length > 0)
             callback(null , response);
            else
            callback({error : "todo not found"}, null)
    }
})