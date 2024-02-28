import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import { authRoute } from './routes/auth'
import { postRoute } from './routes/post'
import { likeRoute } from './routes/like'
import { resolve } from 'node:path'
import { uploadRoute } from './routes/upload'

const app = fastify()

app.register(multipart)
app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})
app.register(cors, {
  origin: true,
})

if (!process.env.SECRET_JWT) {
	throw new Error('JWT_SECRET is not defined')
}
app.register(jwt, {
  secret: process.env.SECRET_JWT as string,
})

app.register(authRoute)
app.register(postRoute)
app.register(likeRoute)
app.register(uploadRoute)

app
  .listen({
    port: 3333
  })
  .then(() => {
    console.log('HTTP server listening on http://localhost:3333')
  })