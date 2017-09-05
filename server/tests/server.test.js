const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} =require('./../models/todo');


var todosToAdd = [{text:"Get chickens"},{text:"Get car"}];
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