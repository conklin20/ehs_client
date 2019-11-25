import React, {  } from 'react'
import Tree from './Tree';
  
const LogicalTree = props => {

    const { logicalHierarchyAttributes, logicalHierarchies, hierarchyLevels, handleChange, handleClick, handleEdit, handleSubmit, currentUser } = props;

    const logicalHierarchyLevels = hierarchyLevels.filter(level => level.hierarchyLevelName.includes('Logical'));    

    return (
        <Tree
            treeType='Logical'
            hierarchyAttributes={logicalHierarchyAttributes}
            hierarchies={logicalHierarchies}
            hierarchyLevels={logicalHierarchyLevels}
            handleChange={handleChange}
            handleClick={handleClick}
            handleEdit={handleEdit}
            handleSubmit={handleSubmit}
            currentUser={currentUser}
        />
    )
}

export default LogicalTree;