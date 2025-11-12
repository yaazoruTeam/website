import { SimCard } from "@model"
import { apiPost, PaginatedResponse, safeGetPaginated } from "./core/apiHelpers"

const ENDPOINT = '/simCard'

export type PaginatedSimCardsResponse = PaginatedResponse<SimCard.Model>

// GET
export const getSimCards = async (page: number): Promise<PaginatedSimCardsResponse> => {
    return safeGetPaginated<SimCard.Model>(ENDPOINT, page)
}

// POST - Create only SIM card
export const createSimCard = async (simCard: Partial<Omit<SimCard.Model, 'simCard_id'>>): Promise<SimCard.Model> => {
    return apiPost<SimCard.Model>(ENDPOINT, simCard)
}

// POST - Create device with SIM card in transaction
export const createDeviceWithSimCard = async (payload: {
    device?: any
    simCard: Partial<Omit<SimCard.Model, 'simCard_id'>>
}): Promise<{ device?: any; simCard: SimCard.Model }> => {
    return apiPost<{ device?: any; simCard: SimCard.Model }>(
        `${ENDPOINT}/device-with-sim`,
        payload
    )
}