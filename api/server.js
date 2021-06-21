"use strict"
// const dotenv = require('dotenv')
// dotenv.config();
// console.log(`dotenv`, dotenv)
const dev = process.env.NODE_ENVIRONMENT === 'development'

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

fastify.route({
    method: "GET",
    url: '/api/nugs/item/:id',
    handler: async (req, _) => {
        let { slug } = req.params
        slug = slug.replace(':', "").trim()
        let data = []//neo4j call
        let results = data?.find(i => i?.id.toString() === slug
            || i?.name?.includes(slug))
        console.log(`result`, { results, slug })
        return {
            itemsFound: results
        }
    }
})

fastify.route({
    method: "GET",
    url: '/api/nugs/item/:slug',
    handler: async (req, _) => {
        let { slug } = req.params
        slug = slug.replace(':', "").trim()
        let data = []//neo4j call
        let results = data?.find(i => i?.id.toString() === slug
            || i?.name?.includes(slug))
        console.log(`result`, { results, slug })
        return {
            itemsFound: results
        }
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