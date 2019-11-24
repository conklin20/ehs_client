import React, {  } from 'react'
import Tree from './Tree';

const PhysicalTree = props => {

    const { physicalHierarchyAttributes, physicalHierarchies, hierarchyLevels, handleChange, handleClick, handleEdit, handleSubmit, currentUser } = props;
      
    const physicalHierarchyLevels = hierarchyLevels.filter(level => level.hierarchyLevelName.includes('Physical'));
    // console.log(physicalHierarchyLevels)
    // console.log(physicalHierarchyAttributes)
    return (
        <Tree
            treeType='Physical'
            hierarchyAttributes={physicalHierarchyAttributes}
            hierarchies={physicalHierarchies}
            hierarchyLevels={physicalHierarchyLevels}
            handleChange={handleChange}
            handleClick={handleClick}
            handleEdit={handleEdit}
            handleSubmit={handleSubmit}
            currentUser={currentUser}
        />
    )
}

export default PhysicalTree;