import { FC, useState } from "react"
import { ElementNode } from "../../../../types"
import StructureNode from "../StructureNode"
import { renderPropValueShort, renderTemplateStructure } from "../../util"
import React from "react"

export type NativeStructureNodeProps = {
  element: ElementNode
}

const NativeStructureNode: FC<NativeStructureNodeProps> = ({ element }) => {
  const [expanded, setExpanded] = useState<boolean>(true)
  return (
    <StructureNode
      expanded={expanded}
      onToggleExpanded={setExpanded}
      header={
        <span>
          &lt;{element.name}{" "}
          {Object.entries(element.attrs).map(([name, value]) => (
            <React.Fragment key={name}>
              <span>
                {name}={renderPropValueShort(value)}
              </span>{" "}
            </React.Fragment>
          ))}
          {!expanded ? ".../" : element.content == null ? "/" : undefined}&gt;
        </span>
      }
    >
      {renderTemplateStructure(element.content)}
    </StructureNode>
  )
}

export default NativeStructureNode
