const app = require('./app');

const userRouter = require('../routers/User');

const authRouter = require('../routers/Auth');

const teamRouter = require('../routers/Team');

const apiPrefix = '/api/v1';

//routers users
app.use('/users', userRouter);

app.use(`${apiPrefix}/auth`, authRouter);

app.use(`${apiPrefix}/teams`, teamRouter);