import { PhotoResponse } from "./photo";
import { UserResponse } from "./user";

export interface PropertyResponse {
    id: number;
    title: string;
    price: number;
    area: number;
    category: string;
    furnish: string;
    city: string;
    address: string;
    imageUrl: string;
    numberImage: number;
    createdAt: Date;
    postedBy: UserResponse;
}

export interface PropertyDetailResponse extends PropertyResponse {
    description: string;
    lat: number;
    lng: number;
    isActive: boolean;
    categoryId: number;
    furnishId: number;
    cityId: number;
    photos: PhotoResponse[];
}

export interface PropertyRequest {
    title: string;
    price: number;
    area: number;
    address: string;
    lat: number;
    lng: number;
    category: number;
    furnish: number;
    description: string;
    cityId: number;
    isActive: boolean;
    images: File[];
}

export interface PropertyParam {
    address: string,
    city: string,
    category: string,
    furnish: string,
    sortBy: string,
    sortDirection: string
}