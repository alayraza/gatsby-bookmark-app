const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb"),
  q = faunadb.query;

const typeDefs = gql`
  type Query {
    allBookmarks: [bookmarkType]
  }
  type Mutation {
    addBookmark(website: String!): bookmarkType
    updateBookmark(id: ID!): bookmarkType
    deleteBookmark(id: ID!): bookmarkType
  }
  type bookmarkType {
    id: ID!
    website: String!
  }
`;

const client = new faunadb.Client({
  secret: "fnAD7pp2tLACAVS4s2El-5uR4wm_Z2EuuGRWIPDQ",
});
const resolvers = {
  Query: {
    allBookmarks: async (root, args, context) => {
      try {
        const result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("all_bookmark"))),
            q.Lambda((x) => q.Get(x))
          )
        );
        const data= result.data.map((d) => {
          return {
            id: d.ref.id,
            website: d.data.website,
          };
        });
        return data;
      } catch (error) {
        console.log(error);
        return error.toString();
      }
    },
  },
  Mutation: {
    addBookmark: async (_, { website }) => {
      try {
        const result = await client.query(
          q.Create(q.Collection("bookmark"), {
            data: {
              website
            },
          })
        );
        // console.log(result.data.task);
        return data;
      } catch (error) {
        return error.toString();
      }
    },
    deleteBookmark: async (_, { id }) => {
      try {
        const reqId = JSON.stringify(id);
        const reqId2 = JSON.parse(id);
        console.log(id);

        const result = await client.query(
          q.Delete(q.Ref(q.Collection("bookmark"), id))
        );
        console.log(result);
        return result.data;
      } catch (error) {
        return error;
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

exports.handler = server.createHandler();
