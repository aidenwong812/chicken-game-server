import express from 'express';
import 'express-async-errors';
// vs-code-organize-imports-disable-next-line
import bodyParser from 'body-parser';
import cors from 'cors';
// import dataContext from 'database';
import dotenv from 'dotenv';
import router from './controllers';
import 'dotenv/config';

import { StatusCode } from './enums/StatusCode';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const expressSwagger = require('express-swagger-generator');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`dist`));

app.use(router);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: any, res: any, next: any) => {
    // dataContext.Log.create({
    //     Message: `${err.message} --------- ${err.stack}`,
    //     AccountId: res.Account?.Id,
    //     Date: new Date(),
    // });
    // eslint-disable-next-line no-console
    console.error('\x1b[31m%s\x1b[0m', err.stack);
    res.status(StatusCode.InternalServerError).send(err.stack);
});

const options = {
    swaggerDefinition: {
        info: {
            description: 'OG Predict API',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: process.env.HOST,
        basePath: '/',
        produces: ['application/json', 'application/xml'],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'authorization',
                description: '',
            },
        },
    },
    basedir: __dirname, // app absolute path
    files: ['./controllers/**/*.ts', './controllers/**/*.js'], // Path to the API handle folder
};

if (process.env.NODE_ENV === 'development') expressSwagger(app)(options);

// app.set('trust proxy', true);

app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log('Listening on port', process.env.PORT, '...');
});
