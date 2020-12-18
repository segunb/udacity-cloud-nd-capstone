import { SuperHero } from "../models/SuperHero";
import { UpdateSuperheroRequest } from '../requests/UpdateSuperheroRequest'
import { CreateSuperheroRequest } from '../requests/CreateSuperheroRequest'
import superheroAccessor from '../dataLayer/superheroAccessor'

export async function getSuperHerosForUser(userId: string): Promise<SuperHero[]> {
    return await superheroAccessor.getSuperHeroForUser(userId)
}

export async function createSuperHero(userId: string, createRequest: CreateSuperheroRequest) {
    return await superheroAccessor.createSuperHero(userId, createRequest)
}

export async function updateSuperHeroForUser(userId: string, superheroItemId: string, updateSuperheroRequest: UpdateSuperheroRequest) {
    const item = await superheroAccessor.getSuperHeroById(superheroItemId)

    if (item.userId !== userId) {
        throw new Error("You can only update items you own")
    }

    await superheroAccessor.updateSuperHero(item, updateSuperheroRequest)
}

export async function deleteSuperHero(userId: string, superheroItemId: string) {
    const item = await superheroAccessor.getSuperHeroById(superheroItemId)

    if (item.userId !== userId) {
        throw new Error("You can only delete items you own")
    }

    await superheroAccessor.deleteSuperHero(item)
}
