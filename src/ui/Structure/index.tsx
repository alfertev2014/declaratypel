import { FC } from "react"

import styles from './styles.module.scss'
import { renderTemplateStructure } from "./util"
import { DeclUITemplate } from "../../types/ui/template"

export type StructureProps = {
  isOpen?: boolean
}

const data: DeclUITemplate = [
  {
    uiTag: 'element',
    name: 'div',
    attrs: {
      foo: 'bar'
    },
    children: {
      uiTag: 'element',
      name: 'div',
      attrs: {
        foo: 'bar',
        b: true
      },
      children: []
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
