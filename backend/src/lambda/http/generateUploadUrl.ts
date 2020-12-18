import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from "aws-sdk";
import * as AWSXRay from 'aws-xray-sdk'

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const AWSX = AWSXRay.captureAWS(AWS)
const s3 = new AWSX.S3({
  signatureVersion: 'v4'
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const superheroId = event.pathParameters.superheroId
  console.log("Generate upload URL called for event: ", event)
  console.log("Generate upload URL called for superheroID " + superheroId)

  const url = getUploadUrl(superheroId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}

function getUploadUrl(imageSuperheroId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageSuperheroId,
    Expires: parseInt(urlExpiration)
  })
}
