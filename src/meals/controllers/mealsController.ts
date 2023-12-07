import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ShowMealService } from './../services/showMealService'
import { CreateMealService } from './../services/createMealService'
import { ListMealsService } from '../services/listMealsService'
import { UpdateMealService } from '../services/updateMealService'
import { DeleteMealService } from '../services/deleteMealService'

export class MealsController {
  async index(request: FastifyRequest, response: FastifyReply) {
    const userId = request.cookies.userId

    const listMealsService = new ListMealsService()
    const meals = await listMealsService.execute({ userId })

    return response.status(200).send({
      meals,
    })
  }

  async show(request: FastifyRequest, response: FastifyReply) {
    const userId = request.cookies.userId

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const showMealService = new ShowMealService()

    const meal = await showMealService.execute({ id, userId })

    response.status(200).send({ meal })
  }

  async create(request: FastifyRequest, response: FastifyReply) {
    const userId = request.cookies.userId

    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      inTheDiet: z.boolean(),
    })

    const body = bodySchema.parse(request.body)

    const createMealService = new CreateMealService()

    await createMealService.execute({ ...body, userId })

    response.status(201).send()
  }

  async update(request: FastifyRequest, response: FastifyReply) {
    const userId = request.cookies.userId

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      inTheDiet: z.boolean(),
    })

    const body = bodySchema.parse(request.body)

    const updateMealService = new UpdateMealService()

    const meal = await updateMealService.execute({ id, userId, ...body })

    response.status(200).send({ meal })
  }

  async delete(request: FastifyRequest, response: FastifyReply) {
    const userId = request.cookies.userId

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const deleteMealService = new DeleteMealService()

    await deleteMealService.execute({ id, userId })

    response.status(204).send()
  }
}
