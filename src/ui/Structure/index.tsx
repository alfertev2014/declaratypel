import { FC } from "react"

import styles from './styles.module.scss'
import { TemplateNode } from "../../types"
import { renderTemplateStructure } from "./util"

export type StructureProps = {
  isOpen?: boolean
}

const data: TemplateNode = [
  {
    type: 'element',
    name: 'div',
    attrs: {
      foo: 'bar'
    },
    content: {
      type: 'element',
      name: 'div',
      attrs: {
        foo: 'bar',
        b: true
      }
    },
  },
]

const Structure: FC<StructureProps> = ({ isOpen = true }) => {
  return isOpen && (
    <div className={styles.panel}>
      {renderTemplateStructure(data)}
    </div>
  )
}

export default Structure
