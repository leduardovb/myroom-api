import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Token } from '../interfaces/Token'
import PayloadDTO from '../classes/dtos/PayloadDTO'

export async function comparePasswords(
  hashedPassword: string,
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function createToken(payload: PayloadDTO) {
  return jwt.sign({ payload }, process.env.AUTHENTICATION_KEY!, {
    expiresIn: '7 days',
  })
}

export function decodeToken(token: string) {
  return jwt.verify(token, process.env.AUTHENTICATION_KEY!) as Token
}

export async function hashPassword(
  password: string,
  salt = 10
): Promise<string> {
  return bcrypt.hash(password, salt)
}

function allCharactersAreEqual(value: string) {
  return value.split('').every((el) => el === value[0])
}

export function isValidPhone(value: string) {
  if (typeof value !== 'string') return false

  value = value.replace(/[^\d]+/g, '')

  if (value.length !== 11) return false

  const dd = value.substring(0, 2)
  if (dd === '00') return false

  const firstPhoneNumber = value.substring(2, 3)
  if (firstPhoneNumber !== '9') return false

  const phoneNumber = value.substring(3)
  if (allCharactersAreEqual(phoneNumber)) return false

  return true
}

export function isValidCPF(value: string) {
  if (typeof value !== 'string') return false

  value = value.replace(/[^\d]+/g, '')

  if (value.length !== 11 || !!value.match(/(\d)\1{10}/)) return false

  if (allCharactersAreEqual(value)) return false

  const values = value.split('').map((el) => +el)
  const rest = (count: number) =>
    ((values
      .slice(0, count - 12)
      .reduce((soma, el, index) => soma + el * (count - index), 0) *
      10) %
      11) %
    10

  return rest(10) === values[9] && rest(11) === values[10]
}
