import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ListUserService } from '../services/listUserService'
import { CreateUserService } from '../services/createUserService'
import { ShowUserService } from '../services/showUserService'
import { UpdateUserService } from '../services/updateUserService'
import { UpdateUserPasswordService } from '../services/updateUserPasswordService'
import { UpdateUserWeightAndHeightService } from '../services/updateUserWeightAndHeightService'
import { DeleteUserService } from '../services/deleteUserService'

export class UsersController {
  async index(request: FastifyRequest, response: FastifyReply) {
    const listUserService = new ListUserService()
    const users = await listUserService.execute()

    return response.status(200).send({
      users,
    })
  }

  async show(request: FastifyRequest, response: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const showUserService = new ShowUserService()

    const user = await showUserService.execute({ id })

    return response.status(200).send({
      user,
    })
  }

  async create(request: FastifyRequest, response: FastifyReply) {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
      height: z.coerce.number(),
      weight: z.coerce.number(),
    })

    const body = bodySchema.parse(request.body)

    const createUser = new CreateUserService()

    const user = await createUser.execute(body)

    return response.status(201).send({
      user,
    })
  }

  async update(request: FastifyRequest, response: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
    })

    const body = bodySchema.parse(request.body)

    const updateUserService = new UpdateUserService()

    const user = await updateUserService.execute({ ...body, id })

    return response.status(200).send({ user })
  }

  async updatePassword(request: FastifyRequest, response: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      password: z.string(),
    })

    const body = bodySchema.parse(request.body)

    const updateUserPasswordService = new UpdateUserPasswordService()

    const user = await updateUserPasswordService.execute({ ...body, id })

    return response.status(200).send({ user })
  }

  async updateHeightAndWeight(request: FastifyRequest, response: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      height: z.coerce.number(),
      weight: z.coerce.number(),
    })

    const body = bodySchema.parse(request.body)

    const updateUserWeightAndHeightService =
      new UpdateUserWeightAndHeightService()

    const user = await updateUserWeightAndHeightService.execute({ ...body, id })

    return response.status(200).send({ user })
  }

  async delete(request: FastifyRequest, response: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const deleteUserService = new DeleteUserService()

    await deleteUserService.execute({ id })

    return response.status(204).send()
  }
}
