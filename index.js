const gprc = require("@grpc/grpc-js");
// const todosProto = gprc.load("./todo.proto");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync("./todo.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const todosProto = gprc.loadPackageDefinition(packageDefinition);

const server = new gprc.Server();

const todos = [
  {
    id: "1",
    name: "ritik",
    content: "file Ok",
  },
  {
    id: "2",
    name: "aadi",
    content: "file Ok also",
  },
];

server.addService(todosProto.TodoService.service, {
  ListTodos: (call, callback) => {
    callback(null, { todos : todos});
  },
  CreateTodo: (call, callback) => {
    let incomingNewTodo = call.request;
    console.log(incomingNewTodo);
    todos.push(incomingNewTodo);
    callback(null, incomingNewTodo);
  },
  GetTodo: (call, callback) => {
    let incomingTodoRequest = call.request;
    let todoId = incomingTodoRequest.id;
    let response = todos.filter((todo) => todo.id === todoId);
    if (response.length > 0) callback(null, response);
    else callback({ error: "todo not found" }, null);
  },
});

server.bindAsync("127.0.0.1:5501", gprc.ServerCredentials.createInsecure(), () => {
  console.log("server started ");

  server.start();
});
