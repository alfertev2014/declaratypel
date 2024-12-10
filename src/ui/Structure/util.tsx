import React from "react";
import { TemplateNode } from "../../types";
import TextStructureNode from "./components/TextStructureNode";
import NativeStructureNode from "./components/NativeStructureNode";
import ComponentStructureNode from "./components/ComponentStructureNode";

export const renderTemplateStructure = (template: TemplateNode): React.ReactNode => {
  if (Array.isArray(template)) {
    return template.map(t => <div>{renderTemplateStructure(t)}</div>);
  } else if (typeof template === 'object') {
    switch (template?.type) {
      case 'element':
        return <NativeStructureNode element={template} />
      case 'component':
        return <ComponentStructureNode component={template} />
    }
  } else {
    return template ? <TextStructureNode text={template.toString()} /> : undefined;
  }
}


export const renderPropValueShort = (value: unknown): React.ReactNode => {
  if (typeof value === 'string') {
    return <span>"{value}"</span>
  }else if (value == null || typeof value === 'boolean' || typeof value === 'number') {
    return <span>{`${value}`}</span>
  } else if (typeof value === 'function') {
    return <span>{`f ${value.name || ''}(...){...}`}</span>
  }
  if (Array.isArray(value)) {
    return <span>{value.length ? `[...${value.length} items]` : '[]'}</span>
  }
  if (typeof value === 'object') {
    return <span>{'{...}'}</span>
  }
}