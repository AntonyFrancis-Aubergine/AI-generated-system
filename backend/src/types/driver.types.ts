import { IVehicleResponseDTO } from './vehicle.types'

// Driver model interface
export interface IDriverProfile {
  id: string
  licenseNumber: string
  licenseExpiry: Date
  experienceYears: number
  rating: number | null
  isAvailable: boolean
  isActive: boolean
  userId: string
  vehicleId: string | null
  createdAt: Date
  updatedAt: Date
}

// Create driver profile request
export interface ICreateDriverProfileRequest {
  userId: string
  licenseNumber: string
  licenseExpiry: Date
  experienceYears?: number
  isAvailable?: boolean
}

// Update driver profile request
export interface IUpdateDriverProfileRequest {
  licenseNumber?: string
  licenseExpiry?: Date
  experienceYears?: number
  rating?: number
  isAvailable?: boolean
  isActive?: boolean
}

// Driver profile response DTO
export interface IDriverProfileResponseDTO {
  id: string
  licenseNumber: string
  licenseExpiry: Date
  experienceYears: number
  rating: number | null
  isAvailable: boolean
  isActive: boolean
  user: {
    id: string
    name: string
    email: string
    contactNumber?: string | null
    profileImageUrl?: string | null
  }
  vehicle: IVehicleResponseDTO | null
  createdAt: Date
  updatedAt: Date
}

// Get driver profiles query params
export interface IGetDriverProfilesQuery {
  page?: number
  limit?: number
  isAvailable?: boolean
  isActive?: boolean
  hasVehicle?: boolean
  minExperience?: number
  minRating?: number
}

// Assign vehicle to driver request
export interface IAssignVehicleRequest {
  vehicleId: string
}
