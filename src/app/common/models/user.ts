export interface RegisterRequest {
    userName: string;
    email: string;
    phone: string;
    password: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface UpdateUserRequest {
    userName: string;
    email: string;
    phone: string;
    password: string;
    newPassword: string;
}
export interface TokenResponse {
    token: string;
}
export interface UserResponse {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: number;
    isActive: boolean;
    isDeleted: boolean;
}
export interface FriendResponse extends UserResponse {
    isOnline: boolean;
    messageUnread: number;
}