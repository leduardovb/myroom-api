interface AddressDTO {
  id: number
  street: string
  buildingCode: string
  complement: string
  neighborhood: string
  zipCode: string
}

interface PhotoDTO {
  id?: number
  name: string
  extension: string
  dataUrl: string
}

interface SpecificationDTO {
  description: string
  amount: number
}

export interface UpdateRentPlaceDTO {
  id: number
  name: string
  description: string
  type: string
  roomType: string
  value: number
  address: AddressDTO
  photos: Array<PhotoDTO>
  specifications: Array<SpecificationDTO>
}
