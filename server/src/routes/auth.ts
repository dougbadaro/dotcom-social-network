import { z } from 'zod'
import { prisma } from '../.lib/prisma'
import * as argon2 from 'argon2'
import { FastifyInstance } from 'fastify';

export async function authRoute(app: FastifyInstance) {
	app.post('/register', async (request, reply) => {
		const bodySchema = z.object({
			name: z.string(),
			email: z.string().email(),
			password: z.string().min(8),
		})

		const {name, email, password} = bodySchema.parse(request.body)

		const existingUser = await prisma.user.findUnique({
			where: {
				email,
			}
		})

		if(existingUser) {
			return reply.status(400).send('User already exists')
		}

		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: await argon2.hash(password),
			}
		})

		const token = app.jwt.sign(
		{
			userId: user.id,
			name: user.name,
			email: user.email,
		},
		{
			expiresIn: '1w'
		})

		return reply.status(200).send({token})
	})

	app.post('/login', async (request, reply) => {
		const bodySchema = z.object({
			email: z.string().email(),
			password: z.string().min(8),
		})

		const {email, password} = bodySchema.parse(request.body)

		const user = await prisma.user.findUnique({
			where: {
				email,
			}
		})

		if(!user) {
			return reply.status(404).send('As credenciais inseridas estão incorretas. Por favor, tente novamente.')
		}

		const validPassword = await argon2.verify(user.password, password)

		if(!validPassword) {
			return reply.status(401).send('As credenciais inseridas estão incorretas. Por favor, tente novamente.')
		}

		const token = app.jwt.sign(
		{
			userId: user.id,
			name: user.name,
			email: user.email,
		},
		{
			expiresIn: '1w'
		})

		return reply.status(200).send({token})
	})
}