import express from 'express';
import express_graphql from 'express-graphql';
import { buildSchema } from "graphql";

//GraphQL Schema
const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    },
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

const coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]
//GraphQL Query
const getCourse = function(args: any) { 
    var id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}

const getCourses = function(args: any) {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

//Mutation to change values
const updateCourseTopic = function(obj: {id: any, topic: string}) {
    coursesData.map(course => {
        if (course.id == obj.id) {
            course.topic = obj.topic;
            return course;
        }
    });
    return coursesData.filter(course => course.id === obj.id) [0];
}
const root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
};

//Creating an express server and a GraphQL endpoint

const {PORT = 300} = process.env;
const app = express();
app.use('/graphql', express_graphql({
    schema:schema,
    rootValue:root,
    graphiql:true
}))
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}/graphql`))