import { FC, useState } from "react"
import StructureNode from "../StructureNode"
import { renderPropValueShort, renderTemplateStructure } from "../../util"
import { DeclUITemplateComponentElement } from "../../../../types/ui/template"

export type ComponentStructureNodeProps = {
  component: DeclUITemplateComponentElement
}

const ComponentStructureNode: FC<ComponentStructureNodeProps> = ({ component }) => {
  const [expanded, setExpanded] = useState<boolean>(true)
  return (
    <StructureNode
      expanded={expanded}
      onToggleExpanded={setExpanded}
      header={
        <span>
          {component.component.name}{" "}
          {Object.entries(component.props).map(([name, value]) => (
            <span>
              {name}={renderPropValueShort(value)}
            </span>
          ))}
        </span>
      }
    >
      {renderTemplateStructure(component.children)}
    </StructureNode>
  )
}

export default ComponentStructureNode
