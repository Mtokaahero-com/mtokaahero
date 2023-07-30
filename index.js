require('dotenv').config();
const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const colors = require('colors');
const cors = require('cors');
const schema = require('./schema/schema');
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.disable('x-powered-by');

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
}));


app.listen(process.env.port, ()=>{ console.log(`Server is running on port ${process.env.port}`)})