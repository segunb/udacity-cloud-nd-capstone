import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateSuperheroRequest } from '../../requests/UpdateSuperheroRequest'

import { createLogger } from '../../utils/logger'
import { updateSuperHeroForUser } from '../../businessLogic/Superhero'
import { getUserId } from "../utils";

const logger = createLogger('updateSuperhero')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const superheroId = event.pathParameters.superheroId
    const updatedSuperhero: UpdateSuperheroRequest = JSON.parse(event.body)

    logger.info("Processing event", event)
    logger.info("Processing update request for item Id", superheroId)

    await updateSuperHeroForUser(getUserId(event), superheroId, updatedSuperhero)
  } catch (e) {
    logger.error("Failed to update Superhero items: ", e.message)

    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Update failed - ' + e.message
      })
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}

