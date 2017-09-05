const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} =require('./../models/todo');


var todosToAdd = [
    { text: "Get chickens", _id: new ObjectID() },
    { text: "Get car", _id: new ObjectID() ,completed:true,completedAt:1234556}
];
//executes before your test case executes
beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todosToAdd);
    }).then(()=>done());
});
describe('POST /todos',()=>{
    it('should create a new todo',(done)=>{
        var text = "Sample text to add for testing";

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            //response from the UI 
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            //to check whether added to DB
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e)=>done(e));
            })
    });

    //check for bad request
    it('should not create todo with invalid body data',(done)=>{
        //var text = "";
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e)=>done())
            });
    })
});

describe('GET /todos',()=>{
    it('Should get all todos',(done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            //response from the UI 
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id',()=>{
    //test case for Id being Invalid
    it('Should return 404 for non-object ids',(done)=>{
        var id = "123";
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
    //test case for Id which not present in collection
    it('Should return 404 if todo not found',(done)=>{
        var newObjId = new ObjectID();
        request(app)
        .get(`/todos/${newObjId.toHexString()}`)
        .expect(404)
        .end(done);
    });
    //test case for Id being present in collection
    it('Should return todo doc',(done)=>{
        request(app)
        .get(`/todos/${todosToAdd[0]._id.toHexString()}`)
        .expect(200)
        //response from the UI 
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todosToAdd[0].text);
        })
        .end(done);
    });
});

describe('DELETE /todos/:id',()=>{
    //test case for Id being Invalid
    it('Should return with 404 if not found',(done)=>{
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    })
    //test case for Id which not present in collection
    it('Should return 404 for object id invalid',(done)=>{
        request(app)
            .delete(`/todos/1234`)
            .expect(404)
            .end(done);
    })
    //test case for Id being present in collection
    it('Should remove a todo',(done)=>{
        var hexId = todosToAdd[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.findById(hexId).then((todo)=>{
                    expect(todo).toNotExist();
                    done();
                }).catch((e)=>done(e));
            });
    });
});

describe('PATCH /todos/:id',()=>{
    it('Should update the todo',(done)=>{
        var hexId = todosToAdd[0]._id.toHexString();
        var changedTodo = {text:"Changed text",completed:true};
        //console.log(hexId)
        request(app)
            .patch(`/todos/${hexId}`)
            .send(changedTodo)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(changedTodo.text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA("number");
            })
            .end(done);
    });

    it('Should clear completedAt when todo is not completed',(done)=>{
        var hexId = todosToAdd[1]._id.toHexString();
        var changedTodo = {text:"Changed text!!",completed:false};
        request(app)
            .patch(`/todos/${hexId}`)
            .send(changedTodo)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(changedTodo.text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});