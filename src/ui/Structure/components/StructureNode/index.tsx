import React, { FC } from "react"

import style from './style.module.scss'

export type StructureNodeProps = {
  expanded?: boolean
  onToggleExpanded?: (value: boolean) => void
  header: React.ReactNode
  children: React.ReactNode
}

const StructureNode: FC<StructureNodeProps> = ({
  expanded,
  onToggleExpanded,
  header,
  children,
}) => {
  return (
    <div className={style.StructureNode}>
      <div
        onClick={
          onToggleExpanded
            ? () => {
                onToggleExpanded(!expanded)
              }
            : undefined
        }
      >
        {header}
      </div>
      {expanded && <div className={style.content}>{children}</div>}
    </div>
  )
}

export default StructureNode
