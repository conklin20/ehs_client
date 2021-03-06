import React, {  } from 'react'
import Tree from './Tree';
  
const PhysicalTree = props => {

    const { physicalHierarchies, hierarchyLevels, handleChange, handleSubmit, handleEdit, currentUser } = props;
      
    const physicalHierarchyLevels = hierarchyLevels.filter(level => level.hierarchyLevelName.includes('Physical'));
    // console.log(physicalHierarchyLevels)
    
    return (
        <Tree
            hierarchies={physicalHierarchies}
            hierarchyLevels={physicalHierarchyLevels}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleEdit={handleEdit}
            currentUser={currentUser}
        />
    )
}

export default PhysicalTree;