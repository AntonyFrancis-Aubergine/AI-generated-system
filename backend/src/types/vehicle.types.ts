// Vehicle status enum
export enum VehicleStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE',
}

// Vehicle model interface
export interface IVehicle {
  id: string
  registrationNumber: string
  model: string
  make: string
  year: number
  color: string
  seatingCapacity: number
  fuelType: string
  status: VehicleStatus
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Create vehicle request body
export interface ICreateVehicleRequest {
  registrationNumber: string
  model: string
  make: string
  year: number
  color: string
  seatingCapacity: number
  fuelType: string
  status?: VehicleStatus
}

// Update vehicle request body
export interface IUpdateVehicleRequest {
  registrationNumber?: string
  model?: string
  make?: string
  year?: number
  color?: string
  seatingCapacity?: number
  fuelType?: string
  status?: VehicleStatus
  isActive?: boolean
}

// Vehicle response DTO
export interface IVehicleResponseDTO {
  id: string
  registrationNumber: string
  model: string
  make: string
  year: number
  color: string
  seatingCapacity: number
  fuelType: string
  status: VehicleStatus
  isActive: boolean
  driverProfile?: {
    id: string
    userId: string
    user: {
      name: string
      email: string
      contactNumber?: string
    }
  } | null
  createdAt: Date
  updatedAt: Date
}

// Get vehicle query params
export interface IGetVehiclesQuery {
  page?: number
  limit?: number
  make?: string
  model?: string
  status?: VehicleStatus
  isActive?: boolean
  isAssigned?: boolean
}
