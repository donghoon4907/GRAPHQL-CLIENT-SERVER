"use strict";

var path = require("path");

var _require = require("graphql-tools"),
    makeExecutableSchema = _require.makeExecutableSchema;

var _require2 = require("merge-graphql-schemas"),
    fileLoader = _require2.fileLoader,
    mergeResolvers = _require2.mergeResolvers,
    mergeTypes = _require2.mergeTypes;

var allTypes = fileLoader(path.join(__dirname, "./**/*.graphql"));
var allResolvers = fileLoader(path.join(__dirname, "./**/*.js"));
var schema = makeExecutableSchema({
  typeDefs: mergeTypes(allTypes),
  resolvers: mergeResolvers(allResolvers)
});
module.exports = schema;