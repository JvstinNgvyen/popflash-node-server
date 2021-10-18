"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const serviceAccount = require('../service-account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const apollo_server_1 = require("apollo-server");
const typeDefs = apollo_server_1.gql `
  type User {
    name: String!
    username: String!
    email: String!
    profileImage: String!
  }

  type Bubble {
    id: ID!
    text: String!
    userId: String!
    user: User!
    likes: Int!
  }

  type Query {
    bubble: [Bubble]
    user: [User]
  }

`;
const resolvers = {
    Query: {
        async bubble() {
            const bubbles = await admin
                .firestore()
                .collection('bubble')
                .get();
            return bubbles.docs.map(bubble => bubble.data());
        },
        async user() {
            const users = await admin
                .firestore()
                .collection('users')
                .get();
            return users.docs.map(user => user.data());
        }
    },
};
const server = new apollo_server_1.ApolloServer({ typeDefs, resolvers });
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
//# sourceMappingURL=index.js.map