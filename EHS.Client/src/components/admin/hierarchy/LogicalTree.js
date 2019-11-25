import React, {  } from 'react'
import Tree from './Tree';
  
const LogicalTree = props => {

    const { logicalHierarchies, hierarchyLevels, handleChange, handleSubmit, handleEdit, currentUser } = props;
        
    const logicalHierarchyLevels = hierarchyLevels.filter(level => level.hierarchyLevelName.includes('Logical'));
    // console.log(logicalHierarchyLevels)

    return (
        <Tree
            hierarchies={logicalHierarchies}
            hierarchyLevels={logicalHierarchyLevels}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleEdit={handleEdit}
            currentUser={currentUser}
        />
    )
}

export default LogicalTree;