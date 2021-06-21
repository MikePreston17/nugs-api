"use strict"
const dotenv = require('dotenv')
dotenv.config();
const dev = process.env.NODE_ENVIRONMENT === 'development'
const uri = process.env.URI
const user = 'neo4j'
const password = process.env.password

// console.log({
//     dev, uri, user, password
// })

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const neo4j = require('neo4j-driver')

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
const session = driver.session()

let firearms = [
    {
        name: "Colt Python 2020 .357",
        cost: 1700,
    }, {
        name: "Saint Victor",
        cost: 1900,
    }, {
        name: "Bubba-Face Blaster",
        cost: 600,
    }, {
        name: "BCM 300 blackout Upper",
        cost: 1050,
    },
]

fastify.route({
    method: "GET",
    url: '/api/nugs/item/:slug',
    handler: async (req, _) => {
        let { slug } = req.params
        slug = slug.replace(':', "").trim()
        let data = []; // Call neo4j here.
        console.log(`data`, data)
        let results = data[0]?.items?.find(i => i?.id.toString() === slug
            || i?.name?.includes(slug))
        console.log(`result`, { results, slug })
        return {
            itemsFound: results
        }
    }
})

fastify.route({
    method: "POST",
    url: "/api/nugs/",
    handler: async (request, _) => {
        console.log('posting new nug...')
        // console.log(`request`, request)
        // console.log(`request.body`, request.body)
        try {
            const result = await session.run(
                'CREATE (a:Nug {name: $name, caliber: $caliber, msrp: $msrp}) RETURN a',
                {
                    ...request.body
                }
            )

            const single = result.records[0];
            const node = single.get(0)

            console.log(`node`, node.properties.name)
        }
        finally {
            // await session.close() //TODO: closing this causes an error for a new query.
        }
    }
})




// Hello World example route:
fastify.route({
    method: 'GET',
    url: '/',
    // schema: {
    //     // request needs to have a querystring with a `name` parameter
    //     querystring: {
    //         name: { type: 'string' }
    //     },
    //     // the response needs to be an object with an `hello` property of type 'string'
    //     response: {
    //         200: {
    //             type: 'object',
    //             // properties: {
    //             //     hello: { type: 'string' }
    //             // }
    //         }
    //     }
    // },
    // this function is executed for every request before the handler is executed
    // preHandler: async (request, reply) => {
    //     // E.g. check authentication
    // },
    handler: async (request, reply) => {
        let query = `MATCH (n) return n LIMIT 25`
        let result = await session.run(query)
        const single = result.records[0];
        const node = single.get(0)

        let nugs = result.records.map(n => n.get(0).properties)
        dev && console.log(`nugs`, nugs)
        return nugs
    }
})

// Run the server!
const start = async () => {
    try {
        await fastify.listen(3000)
    } catch (err) {
        await driver.close(); // close neo4j connection on failure.
        fastify.log.error(err)
        process.exit(1)
    }
}
start()