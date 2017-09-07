const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} =require('./../models/todo');
const {User} =require('./../models/user');
const {todosToAdd, populateTodos,populateUsers,userToAdd} = require('./seed/seed');

//executes before your test case executes
beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /users/me',()=>{
    //test case for valid auth token
    it('should return user if authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth',userToAdd[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(userToAdd[0]._id.toHexString())
                expect(res.body.email).toBe(userToAdd[0].email)
            })
            .end(done);
    });
    //test case for no auth token
    it('should return 401 if not authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});

describe('POST /users',()=>{
    it('should create a user',(done)=>{
        var email = "sample@exp.com";
        var password = "123abc";

        request(app)
            .post('/users')
            .send({email,password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err,user)=>{
                if(err){
                    return done(err);
                }
                User.findOne({email}).then((user)=>{
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e)=>done(e));;
            });
    });

    it('should should return validation errors if request invalid',(done)=>{
        var email = "sampxp.com";
        var password = "123abc";

        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .end(done);
    });

    it('should not create a user if email in use',(done)=>{
        var email = "sample@exp.com";
        var password = "123abc";

        request(app)
            .post('/users')
            .send(userToAdd[0])
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login',()=>{
    it('Should login user and return auth token',(done)=>{
        request(app)
            .post('/users/login')
            .send({email:userToAdd[1].email,password:userToAdd[1].password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
            })
            .end((err,res)=>{
                if(err){
                   return done(err);
                }
                User.findById(userToAdd[1]._id).then((doc)=>{
                    expect(doc.tokens[0]).toInclude({
                        access:'auth',
                        token:res.headers['x-auth']
                    });
                    done();
                }).catch((e)=>done(e));
            });
    });
    it('Should reject invalid login',(done)=>{
        request(app)
            .post('/users/login')
            .send({email:userToAdd[1].email,password:"wrongPassword"})
            .expect(400)
            .expect((res)=>{
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                User.findById(userToAdd[1]._id).then((doc)=>{
                    expect(doc.tokens.length).toBe(0);
                    done();
                }).catch((e)=>done(e));
            });
    });
});

describe('DELETE /users/me/token',()=>{
    it('Should remove auth token on logout',(done)=>{
        request(app)
            .delete('/users/me/token')
            .set('x-auth',userToAdd[0].tokens[0].token)
            .expect(200)
            .end((err,user)=>{
                if(err){
                    return done(err);
                }
                User.findById(userToAdd[0]._id).then((user)=>{
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e)=>done(e));
            });
    });
});