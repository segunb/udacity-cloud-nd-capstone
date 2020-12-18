import {jest} from '@jest/globals';
import * as businessLogicFunctions from '../../src/businessLogic/SuperHero'
import superheroAccessor from '../../src/dataLayer/superheroAccessor'
import {SuperHero} from "../../src/models/SuperHero";
import {CreateSuperheroRequest} from "../../src/requests/CreateSuperHeroRequest";

const validUserId = 'validUser'

let mockSuperHeroItems: SuperHero[] = []
mockSuperHeroItems[validUserId]  = [
    {
        "userId": validUserId,
        "superheroId": "001",
        "createdAt": "2019-07-27T20:01:45.424Z",
        "name": "Superman",
        "desc": "Wears tights over his trousers",
        "attachmentUrl": "http://metropolisplus.com/Superman/supers.jpg"
    },
    {
        "userId": validUserId,
        "superheroId": "002",
        "createdAt": "2019-07-27T20:01:45.424Z",
        "name": "Hulk",
        "desc": "Loves to eat flies",
        "attachmentUrl": "http://metropolisplus.com/Superman/supers.jpg"
    }
]

jest.mock('../../src/dataLayer/superheroAccessor')

const mockGetSuperHeroForUser = jest.fn((userId: string) => {
    return Promise.resolve(mockSuperHeroItems[userId])
})

const mockCreateSuperHero = jest.fn((userId: string, heroRequest: CreateSuperheroRequest) => {
    const heroItem = getSingleHero()
    heroItem.userId = userId
    heroItem.name = heroRequest.name
    return Promise.resolve(heroItem)
})

superheroAccessor.getSuperHeroForUser = mockGetSuperHeroForUser
superheroAccessor.createSuperHero = mockCreateSuperHero

test('should restrict Hero items belonging to user', () => {
    return businessLogicFunctions.getSuperHerosForUser(validUserId)
        .then(data => expect(data).toEqual(mockSuperHeroItems[validUserId]))
})

test('should create Hero item using request values', () => {
    const newHeroName = "New Hero item"
    const newHeroDesc = "New Hero discription"

    const createSuperheroRequest = {"desc": newHeroDesc, "name": newHeroName} as CreateSuperheroRequest
    return businessLogicFunctions.createSuperHero(validUserId, createSuperheroRequest)
        .then(data => expect(data.name).toEqual(newHeroName))
})

function getSingleHero() {
    return mockSuperHeroItems[validUserId][0]
}
