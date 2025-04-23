import { FC, useState } from "react"
import StructureNode from "../StructureNode"
import { renderPropValueShort, renderTemplateStructure } from "../../util"
import React from "react"
import { DeclUITemplateNativeElement } from "../../../../types/ui/template"

export type NativeStructureNodeProps = {
  element: DeclUITemplateNativeElement
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
          {!expanded ? ".../" : element.children == null ? "/" : undefined}&gt;
        </span>
      }
    >
      {renderTemplateStructure(element.children)}
    </StructureNode>
  )
}

export default NativeStructureNode
