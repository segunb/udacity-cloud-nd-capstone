import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {SuperHero} from "../models/SuperHero";

import {UpdateSuperheroRequest} from "../requests/UpdateSuperheroRequest";
import {CreateSuperheroRequest} from "../requests/CreateSuperheroRequest";

import * as AWS from "aws-sdk";
// import * as AWSXRay from 'aws-xray-sdk'
import {createLogger} from "../utils/logger";
import * as uuid from 'uuid'

const AWSXRay = require('aws-xray-sdk');
const logger = createLogger('superheroAccess')
const AWSX = AWSXRay.captureAWS(AWS)
const bucketName = process.env.IMAGES_S3_BUCKET

const s3 = new AWSX.S3({
    signatureVersion: 'v4'
})

export class superheroAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWSX.DynamoDB.DocumentClient(),
        private readonly superheroTable: string = process.env.SUPERHEROS_TABLE,
        private readonly superheroIdIndex: string = process.env.SUPERHERO_ID_INDEX) {
    }

    async getSuperHeroForUser(userId: string): Promise<SuperHero[]> {

        const superheroItems = await this.docClient.query({
            TableName: this.superheroTable,
            KeyConditionExpression: "userId = :uId",
            ExpressionAttributeValues: {":uId": userId}
        }).promise()

        const items = superheroItems.Items as SuperHero[]

        logger.info("Query to get superheroItems returned: ", items)
        console.log("Query returned:", items)

        let itemsWithImages: SuperHero[] = []

        for (let i=0; i<items.length; i++) {
            const hero = items[i]
            const heroHasImage = await this.objectExists(bucketName, hero.superheroId)
            if (heroHasImage)
                itemsWithImages.push(this.appendAttachmentIfExists(hero))
            else
                itemsWithImages.push(hero)
        }

        return itemsWithImages
    }

    async getSuperHeroById(superheroId: string): Promise <SuperHero> {

        if (!superheroId) {
            throw new Error("superheroId is missing")
        }

        const superheroItems = await this.docClient.query({
            TableName: this.superheroTable,
            IndexName: this.superheroIdIndex,
            KeyConditionExpression: "superheroId = :superheroId",
            ExpressionAttributeValues: {":superheroId": superheroId},
            ScanIndexForward: false
        }).promise()

        return superheroItems.Items[0] as SuperHero
    }

    async createSuperHero(userId: string, createRequest: CreateSuperheroRequest): Promise<SuperHero> {
        const itemId = uuid.v4()
        const newItem = {
            superheroId: itemId,
            userId: userId,
            createdAt: Date.now().toString(),
            ...createRequest
        }

        await this.docClient.put({
            TableName: this.superheroTable,
            Item: newItem
        }).promise()

        return newItem as SuperHero
    }

    async updateSuperHero(superheroItem: SuperHero, updateSuperheroRequest: UpdateSuperheroRequest) {

        const params = this.constructUpdateParams(superheroItem, updateSuperheroRequest)
        console.log("Update params: ", params)
        await this.docClient.update(params, function(err, data) {
            if (err) {
                logger.error("Unable to update superhero item. Error JSON:", JSON.stringify(err, null, 2));
                throw new Error("Unable to update superhero item: " + err.message)
            } else {
                logger.info("Update succeeded:", JSON.stringify(data, null, 2));
            }
        }).promise();

    }

    async deleteSuperHero(superheroItem: SuperHero) {
        await this.docClient.delete({
            TableName: this.superheroTable,
            Key: {
                superheroId: superheroItem.superheroId,
                userId: superheroItem.userId
            }
        }).promise()
    }

    appendAttachmentIfExists(p_superheroItem: SuperHero) : SuperHero {
        try {
            console.log("Before check for attachment")

            const signedUrl = s3.getSignedUrl('getObject', {
                Bucket: bucketName,
                Key: p_superheroItem.superheroId
            })

            console.log("SignedURL:" + signedUrl)

            p_superheroItem.attachmentUrl = signedUrl
            return p_superheroItem
        } catch (e) {
            console.log("No image detected for ID " + p_superheroItem.superheroId)
        }

        return p_superheroItem
    }

    async objectExists(bucket, key): Promise<boolean> {
        try {
            const resp = await s3.headObject({
                Bucket: bucket,
                Key: key,
            }).promise();

            console.log("objectExists returned:", resp)
            return true;
        } catch (err) {
            console.log("Error while checking hero file object exists in S3:", err)
            return false;
        }
    }

    constructUpdateParams(p_superheroItem, p_newValues) {
        return {
            TableName: this.superheroTable,
            Key: {
                "userId": p_superheroItem.userId,
                "superheroId": p_superheroItem.superheroId,
            },
            UpdateExpression: "SET #_name = :n, dueDate = :dd, done = :d",
            ExpressionAttributeValues: {
                ":n": p_newValues.name,
                ":dd": p_newValues.dueDate,
                ":d" : p_newValues.done
            },
            ExpressionAttributeNames: {
                "#_name": "name"
            }
        }
    }
}
