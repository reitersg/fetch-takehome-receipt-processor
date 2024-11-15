'use strict'
var y = require('fastify'),
    r = require('zod'),
    uuid = require('uuid'),
    fastifyTypeProviderZod = require('fastify-type-provider-zod')
function _interopDefault(e) {
    return e && e.__esModule ? e : { default: e }
}
var y__default = /*#__PURE__*/ _interopDefault(y)
var r__default = /*#__PURE__*/ _interopDefault(r)
var f = r__default.default.array(
        r__default.default.object({
            shortDescription: r__default.default.string(),
            price: r__default.default.string(),
        })
    ),
    l = r__default.default.object({
        retailer: r__default.default.string(),
        purchaseDate: r__default.default.string().date(),
        purchaseTime: r__default.default.string(),
        items: f,
        total: r__default.default.string(),
    })
var p = (o) => {
        return o.replace(/[^a-zA-Z0-9]/g, '').length
    },
    m = (o) => {
        let t = o.split('.')[1],
            e = t === '00' ? 50 : 0
        return Number(t) % 25 === 0 && (e += 25), e
    },
    u = (o) => {
        let t = Math.floor(o.length / 2) * 5
        return (
            console.log(t),
            o.reduce(
                (s, i) => (
                    i.shortDescription.trim().length % 3 === 0 &&
                        (s += Math.ceil(Number(i.price) * 0.2)),
                    s
                ),
                t
            )
        )
    },
    g = (o, t) => {
        let e = 0,
            s = Number(o.split('-')[2]),
            i = Number(t.split(':')[0])
        return s % 2 !== 0 && (e += 6), i >= 14 && i < 16 && (e += 10), e
    }
var c = y__default.default()
c.setValidatorCompiler(fastifyTypeProviderZod.validatorCompiler)
c.setSerializerCompiler(fastifyTypeProviderZod.serializerCompiler)
var h = new Map()
c.get('/', {}, (o, t) => {
    t.send('ok')
})
c.withTypeProvider().post(
    '/receipts/process',
    { schema: { body: l } },
    (o, t) => {
        let e = uuid.v4()
        h.set(e, o.body), t.send({ id: e })
    }
)
c.withTypeProvider().get(
    '/receipts/:id/points',
    { schema: { params: r.z.object({ id: r.z.string().uuid() }) } },
    (o, t) => {
        let e = h.get(o.params.id)
        console.log(e)
        let s = p(e.retailer)
        console.log(s)
        let i = m(e.total)
        console.log(i)
        let n = u(e.items)
        console.log(n)
        let a = g(e.purchaseDate, e.purchaseTime)
        console.log(a), t.send(s + i + n + a)
    }
)
async function T() {
    await c.ready(),
        await c.listen({ port: 3e3 }),
        console.log(
            'Documentation running at http://localhost:3000/documentation'
        )
}
T()
