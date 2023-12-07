import { FastifyReply, FastifyRequest } from 'fastify'

import { SummaryMealService } from './../services/summaryMealService'

export class SummaryController {
  async index(request: FastifyRequest, response: FastifyReply) {
    const userId = request.cookies.userId

    const summaryMealService = new SummaryMealService()
    const summary = await summaryMealService.execute({ userId })

    return response.status(200).send({
      summary,
    })
  }
}
