import * as documents from './documents'
import * as objects from './objects'
import * as utilObjects from './utilObjects'

export const schemaTypes = [
  ...Object.values(documents),
  ...Object.values(objects),
  ...Object.values(utilObjects),
]
