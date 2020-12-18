import { apiEndpoint } from '../config'
import { SuperHero } from '../types/SuperHero';
import { CreateSuperHeroRequest } from '../types/CreateSuperHeroRequest';
import Axios from 'axios'
import { UpdateSuperHeroRequest } from '../types/UpdateSuperHeroRequest';

export async function getSuperHeros(idToken: string): Promise<SuperHero[]> {
  console.log('Fetching superheroes')

  const response = await Axios.get(`${apiEndpoint}/superhero`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('SuperHeros:', response.data)
  return response.data.items
}

export async function createSuperHero(
  idToken: string,
  newSuperHero: CreateSuperHeroRequest
): Promise<SuperHero> {
  const response = await Axios.post(`${apiEndpoint}/superhero`,  JSON.stringify(newSuperHero), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchSuperHero(
  idToken: string,
  superheroId: string,
  updatedSuperHero: UpdateSuperHeroRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/superhero/${superheroId}`, JSON.stringify(updatedSuperHero), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteSuperHero(
  idToken: string,
  superheroId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/superhero/${superheroId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  superheroId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/superhero/${superheroId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
