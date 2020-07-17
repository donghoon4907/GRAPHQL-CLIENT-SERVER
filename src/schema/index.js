const path = require("path");
const { makeExecutableSchema } = require("graphql-tools");
const {
  fileLoader,
  mergeResolvers,
  mergeTypes
} = require("merge-graphql-schemas");

const allTypes = fileLoader(path.join(__dirname, "./**/*.graphql"));
const allResolvers = fileLoader(path.join(__dirname, "./**/*.js"));

const schema = makeExecutableSchema({
  typeDefs: mergeTypes(allTypes),
  resolvers: mergeResolvers(allResolvers)
});

module.exports = schema;
