import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import routes from "./routes";

const SERVER_PORT = 3000
createConnection().then(async connection => {

    // create express app
    const app = express();

    app.use(bodyParser.json());
    app.use('/', routes)
    // app.use('/', (req, resp) => {
    //     console.log('Request received.', req.query)
    //     resp.send(`Hi client from backend :) name=${req.query.name}; email=${req.query.email}`)
    // })

    // setup express app here
    // ...
    // start express server
    app.listen(SERVER_PORT);

    // insert new users for test

    console.log(`Express server has started on port ${SERVER_PORT}. Open http://localhost:${SERVER_PORT} to see results`);

}).catch(error => console.log(error));
