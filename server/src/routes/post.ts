import { FastifyInstance } from 'fastify';
import { prisma } from '../.lib/prisma';
import { z } from 'zod';

export async function postRoute(app: FastifyInstance) {
	app.get('/post', async (request, response) => {
		const posts = await prisma.post.findMany({
			include: {
				author: true,
				Likes: {
					include: {
						user: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		return response.send(posts.map((post) => {
			return {
				id: post.id,
				imageUrl: post.imageUrl,
				caption: post.caption,
				likes: post.Likes.map((like) => like.user.id),
				createdAt: post.createdAt,
				author: post.author.name
			}
		}));
	})

	app.post('/post', async (request, response) => {
		const bodySchema = z.object({
			imageUrl: z.string(),
			caption: z.string(),
			authorId: z.string()
		})

		const {imageUrl, caption, authorId} = bodySchema.parse(request.body);

		const existingPost = await prisma.post.findFirst({
			where: {
				imageUrl,
				caption,
			}
		})

		if (existingPost) {
			return response.status(400).send('Post already exists');
		}

		await prisma.post.create({
			data: {
				imageUrl,
				caption,
				author: {
					connect: {
						id: authorId
					}
				}
			}
		})

		return response.status(201).send('Post created');
	})
}