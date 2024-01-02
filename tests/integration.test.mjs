import chai from 'chai';
import chaiHttp from 'chai-http';
import { default as server } from '../index.js';
const should = chai.should();

chai.use(chaiHttp);

// Define your test suite
describe('User API', () => {
    // Test the POST /api/user/register endpoint
    describe('POST /api/user/register', () => {
        it('should register a new user', (done) => {
            const newUser = {
                username: 'TestUser',
                email: 'test@example.com',
                password: 'testpassword',
            };

            chai.request(server)
                .post('/api/user/register')
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('email').eql(newUser.email);
                    done();
                });
        });
    });

    // Test the POST /api/user/login endpoint
    describe('POST /api/user/login', () => {
        it('should log in an existing user', (done) => {
            const existingUser = {
                email: 'test@example.com',
                password: 'testpassword',
            };

            chai.request(server)
                .post('/api/user/login')
                .send(existingUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('accessToken');
                    done();
                });
        });

        it('should return an error for incorrect login credentials', (done) => {
            const incorrectCredentials = {
                email: 'test@example.com',
                password: 'wrongpassword',
            };

            chai.request(server)
                .post('/api/user/login')
                .send(incorrectCredentials)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('should return an error for missing login fields', (done) => {
            const missingFields = {
                // Missing email and password
            };

            chai.request(server)
                .post('/api/user/login')
                .send(missingFields)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });
});

describe('Notes API', () => {
    let authToken;
    let noteId;

    before(async () => {
        // Before all tests, get an authentication token
        authToken = await getAuthToken();
    });

    // Test the GET /api/notes endpoint
    describe('GET /api/notes', () => {
        it('should get all notes', (done) => {
            chai.request(server)
                .get('/api/notes')
                .set('Authorization', `Bearer ${authToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    done();
                });
        });
    });

    // Test the POST /api/notes endpoint
    describe('POST /api/notes', () => {
        it('should create a new note', (done) => {
            const newNote = {
                title: 'Test Note',
                content: 'This is a test note.',
            };

            chai.request(server)
                .post('/api/notes')
                .set('Authorization', `Bearer ${authToken}`)
                .send(newNote)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('title').eql(newNote.title);
                    res.body.should.have.property('content').eql(newNote.content);
                    noteId = res.body._id; // Save the note ID for future tests
                    done();
                });
        });
    });

    // Test the GET /api/notes/:id endpoint
    describe('GET /api/notes/:id', () => {
        it('should get a single note by ID', (done) => {
            chai.request(server)
                .get(`/api/notes/${noteId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('_id').eql(noteId);
                    done();
                });
        });
    });

    // Test the PUT /api/notes/:id endpoint
    describe('PUT /api/notes/:id', () => {
        it('should update a note by ID', (done) => {
            const updatedNote = {
                title: 'Updated Test Note',
                content: 'This is an updated test note.',
            };

            chai.request(server)
                .put(`/api/notes/${noteId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedNote)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('title').eql(updatedNote.title);
                    res.body.should.have.property('content').eql(updatedNote.content);
                    done();
                });
        });
    });

    // Test the DELETE /api/notes/:id endpoint
    describe('DELETE /api/notes/:id', () => {
        it('should delete a note by ID', (done) => {
            chai.request(server)
                .delete(`/api/notes/${noteId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('_id').eql(noteId);
                    done();
                });
        });
    });
});