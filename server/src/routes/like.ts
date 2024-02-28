import { z } from 'zod';
import { prisma } from '../.lib/prisma';
import { FastifyInstance } from 'fastify';

export async function likeRoute(app: FastifyInstance) {
	app.post('/like', async (request, response) => {
		const bodySchema = z.object({
			userId: z.string(),
			postId: z.string()
		})

		const { userId, postId } = bodySchema.parse(request.body);

		const existingLike = await prisma.likes.findFirst({
			where: {
				Post: {
					id: postId
				},
				user: {
					id: userId
				}
			}
		})

		if (existingLike) {
			await prisma.likes.delete({
				where: {
					id: existingLike.id
				}
			})
		} else {
			await prisma.likes.create({
				data: {
					user: {
						connect: {
							id: userId
						}
					},
					Post: {
						connect: {
							id: postId
						}
					}
				}
			})
		}

		return response.send(200);
	})
}