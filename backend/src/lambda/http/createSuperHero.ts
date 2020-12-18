import 'source-map-support/register'

import { getUserId } from '../utils'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateSuperheroRequest } from '../../requests/CreateSuperheroRequest'
import { createLogger } from '../../utils/logger'
import { createSuperHero } from "../../businessLogic/Superhero";

const logger = createLogger('createSuperhero')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Processing event: ", event)

  try {
    const newSuperheroRequest: CreateSuperheroRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const newItem = await createSuperHero(userId, newSuperheroRequest)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newItem
      })
    }

  } catch (e) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Create Superhero item failed - ' + e.message
      })
    }
  }
}
