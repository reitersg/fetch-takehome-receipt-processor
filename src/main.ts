import server from './app.js'

async function run() {
    await server.ready()

    await server.listen({
        port: 3000,
        host: '0.0.0.0'
        
    })

    console.log(`Documentation running at http://localhost:3000/documentation`)
}

run()
