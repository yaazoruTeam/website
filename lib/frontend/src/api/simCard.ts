import { SimCard } from "@model"
import { apiDelete, apiGet, apiPost, PaginatedResponse, safeGetPaginated, apiPut } from "./core/apiHelpers"

const ENDPOINT = '/simCard'

export type PaginatedSimCardsResponse = PaginatedResponse<SimCard.Model>

// GET
export const getSimCards = async (page: number): Promise<PaginatedSimCardsResponse> => {
    return safeGetPaginated<SimCard.Model>(ENDPOINT, page)
}

// GET - Get SIM cards with joined devices
export const getSimCardsWithDevices = async (page: number): Promise<PaginatedSimCardsResponse> => {
    return safeGetPaginated<SimCard.Model>(`${ENDPOINT}/with-devices`, page)
}

// GET - Get SIM cards by customer ID with joined devices
export const getSimCardsByCustomerId = async (customer_id: number, page: number = 1): Promise<PaginatedSimCardsResponse> => {
    return safeGetPaginated<SimCard.Model>(`${ENDPOINT}/customer/${customer_id}`, page)
}

// GET - Get SIM card by ID with joined device
export const getSimCardById = async (simCard_id: number): Promise<SimCard.Model> => {
    return apiGet<SimCard.Model>(`${ENDPOINT}/${simCard_id}`, {})
}

// GET - Get SIM cards without customer but with device
export const getSimCardsWithoutCustomerButWithDevice = async (page: number): Promise<PaginatedSimCardsResponse> => {
    return safeGetPaginated<SimCard.Model>(`${ENDPOINT}/without-customer`, page)
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

// POST - Create only SIM card
export const deleteSimCard = async (simCard_id: number): Promise<SimCard.Model> => {
    return apiDelete<SimCard.Model>(`${ENDPOINT}/${simCard_id}`)
}

// PATCH - Update only the fields provided
export const updateSimCard = async (simCard_id: number, updates: Partial<SimCard.Model>): Promise<SimCard.Model> => {
    return apiPut<SimCard.Model>(`${ENDPOINT}/${simCard_id}`, updates)
}