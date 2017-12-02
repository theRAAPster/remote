var request = require('supertest');
var app = require ('../server.js');

describe('GET /', function() {
    it('respond with hooray! welcome to our api!', function(done) {
        request(app)
            .get('/')
            .expect('hooray! welcome to our api!', done);
    });
});