const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args) => links.find(x => x.id === args.id)
  },
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  },
  Mutation: {
    createLink: (parent, args) => {
      let idCount = links.length
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    },
    updateLink: (parent, args) => {
      let linkIndex = links.findIndex((obj) => obj.id === args.id)

      if (linkIndex >= 0){
        if (args.description !== null)
          links[linkIndex].description = args.description
        if (args.url !== null)
          links[linkIndex].url = args.url

        return links[linkIndex]
      }
      return null
    }
  }
}

// 3
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );