const { projects, clients } = require('../sampledata');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList } = require('graphql');

const clientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
    })
});

// projects
const projectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: clientType,
            resolve(parent, args){
                return clients.find((client) => client.id === parent.clientId);
            }
        }
    })
});
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        client: {
            type: clientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return clients.find(client => client.id == args.id);
            }
        },
        clients: {
            type: GraphQLList(clientType),
            resolve(parent, args) {
                return clients;
            }
        },
        //projects
        projects: {
            type: GraphQLList(projectType),
            resolve(parent, args) {
                return projects
            }
        },
        project: {
            type: projectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return projects.find(project => project.id === args.id);
            }
        }
    }
});



module.exports = new GraphQLSchema({
    query: RootQuery
});