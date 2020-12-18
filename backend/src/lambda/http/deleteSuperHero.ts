import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { deleteSuperHero } from "../../businessLogic/Superhero";
import {getUserId} from "../utils";

const logger = createLogger('deleteSuperhero')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const superheroId = event.pathParameters.superheroId

  logger.info("Delete handler called for event: ", event)

  try {
    await deleteSuperHero(getUserId(event), superheroId)
  } catch(e) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Delete failed - ' + e.message
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
