interface AddressDTO {
  street: string
  buildingCode: string
  complement: string
  neighborhood: string
  zipCode: string
}

interface PhotoDTO {
  name: string
  extension: string
  dataUrl: string
}

interface SpecificationDTO {
  description: string
  amount: number
}

export interface CreateRentPlaceDTO {
  name: string
  description: string
  type: string
  roomType: string
  value: number
  address: AddressDTO
  photos: Array<PhotoDTO>
  specifications: Array<SpecificationDTO>
}
