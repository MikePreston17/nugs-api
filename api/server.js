"use strict"
// const dotenv = require('dotenv')
// dotenv.config();
// console.log(`dotenv`, dotenv)
const dev = process.env.NODE_ENVIRONMENT === 'development'

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

const firearms = [
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
    url: '/api/farm/item/:slug',
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

// Hello World example route:
fastify.route({
    method: 'GET',
    url: '/',
    schema: {
        // request needs to have a querystring with a `name` parameter
        querystring: {
            name: { type: 'string' }
        },
        // the response needs to be an object with an `hello` property of type 'string'
        response: {
            200: {
                type: 'object',
                properties: {
                    hello: { type: 'string' }
                }
            }
        }
    },
    // this function is executed for every request before the handler is executed
    preHandler: async (request, reply) => {
        // E.g. check authentication
    },
    handler: async (request, reply) => {
        return firearms
    }
})

// Run the server!
const start = async () => {
    try {
        await fastify.listen(3000)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()