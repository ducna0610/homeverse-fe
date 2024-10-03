export interface ContactResponse {
    id: number,
    name: string,
    email: string,
    phone: string,
    message: string,
    createdAt: string
}

export interface ContactRequest {
    name: string,
    email: string,
    phone: string,
    message: string,
}