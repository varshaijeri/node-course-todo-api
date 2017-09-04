const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} =require('./../models/todo');

//executes before your test case executes
beforeEach((done)=>{
    Todo.remove({}).then(()=>done());
});
describe('POST /todos',()=>{
    it('should create a new todo',(done)=>{
        var text = "Sample text to add for testing";

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find().then((todos)=>{
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
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e)=>done())
            });
    })
});