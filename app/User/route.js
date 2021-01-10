const user = require('./controller');
const { authenticateJWT } = require("../Middleware/auth");

module.exports = (app) => {
    app.get('/user', authenticateJWT, user.findAll);
    app.get('/user/getDetail/', user.getDetailUser);
    app.get('/user/department/', authenticateJWT, user.findMemberDepartment);
    app.get('/user/department/getLeader/',authenticateJWT, user.findLeaderDepartment);

    app.get("/user/teampj/", authenticateJWT, user.findMemberTeampj);
    app.post('/user/register', user.create);


    app.post('/user/login', user.login);

    app.put('/user/:userId', user.update);

    app.put('/user/change-pass/:userId', user.changePasswords);
}