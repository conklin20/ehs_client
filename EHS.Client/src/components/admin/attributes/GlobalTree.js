import React, {  } from 'react'
import Tree from './Tree';
  
const GlobalTree = props => {
    const { globalHierarchyAttributes, handleChange, handleClick, handleEdit, handleSubmit, currentUser } = props;
            
    return (
        <Tree
            treeType='Global'
            hierarchyAttributes={globalHierarchyAttributes}
            handleChange={handleChange}
            handleClick={handleClick}
            handleEdit={handleEdit}
            handleSubmit={handleSubmit}
            currentUser={currentUser}
        />
    )
}

export default GlobalTree;