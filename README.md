# Receipt Processor

## Running on Docker

Run the following commands to run using Docker

```sh
docker build -t fastify-fetch
docker run -p 3000:3000 fastify-fetch
```

The endpoints can be hit through any means e.g. cURL, Postman, etc.
A swagger docs page is also available for hitting the endpoints served through the `/documentation` endpoint
