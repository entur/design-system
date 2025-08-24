import * as documents from './documents'
import * as objects from './objects'
import * as utilObjects from './utilObjects'

export {componentDoc} from './documents/componentDoc'
export {codeExample} from './objects/codeExample'
export {doDontGroup} from './objects/doDontGroup'
export {doDontCard} from './objects/doDontCard'
export {propsTable} from './objects/propsTable'
export {copyableText} from './objects/copyableText'
export {componentTokensTable} from './objects/componentTokensTable'

export const schemaTypes = [
  ...Object.values(documents),
  ...Object.values(objects),
  ...Object.values(utilObjects),
]
