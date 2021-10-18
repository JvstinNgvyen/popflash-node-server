import * as admin from 'firebase-admin';

const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

import { ApolloServer, ApolloError, ValidationError, gql } from 'apollo-server';

interface User {
  id: string;
  name: string;
  screenName: string;
  statusesCount: number;
}

interface Bubble {
  id: string;
  likes: number;
  text: string;
  userId: string;
}

const typeDefs = gql`
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
      return bubbles.docs.map(bubble => bubble.data()) as Bubble[];
    },
    async user() {
        const users = await admin
        .firestore()
        .collection('users')
        .get();
      return users.docs.map(user => user.data()) as User[];
    }
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});