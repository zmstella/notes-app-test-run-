const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('./db');
const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();

app.use(cors());

db.connect(DB_HOST);

// Get the user info from a JWT
function getUser(token) {
  if (token) {
    try {
      // Return the user information from the token
      return jwt.verify(token, process.env.JWT_SECRET);
      // If there's a problem with the token, throw an error
    } catch (err) {
      throw new Error('Session invalid');
    }
  }
}

//Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
  context: ({ req }) => {
    // Get user tokens from the headers
    const token = req.headers.authorization;
    // Try to retrieve a user with the token
    const user = getUser(token);
    // Add the db models and the user to the context
    return { models, user };
  },
});

//Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath})`
  )
);
