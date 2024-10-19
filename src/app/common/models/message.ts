import { UserResponse } from "./user";

export interface MessageRequest {
    content: string,
    receiverId: number,
}

export interface MessageResponse {
    id: number,
    content: string,
    sender: UserResponse,
    receiver: UserResponse,
    isReaded: boolean,
    createdAt: Date,
}