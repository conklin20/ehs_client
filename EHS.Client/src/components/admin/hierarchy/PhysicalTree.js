import React, {  } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Tree from './Tree';
  
const useStyles = makeStyles(theme => ({
    tree: {
        height: 264,
        flexGrow: 1,
        textAlign: 'left',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginTop: 0,
      width: '80%',
    },
    button: {
      margin: theme.spacing(1),
    },
  }));

const PhysicalTree = props => {
    const classes = useStyles(); 

    const { physicalHierarchies, hierarchyLevels, handleChange, handleSubmit, handleEdit } = props;
        
    const rootLevel = hierarchyLevels.find(level => level.hierarchyLevelName === 'Root')
    const level1 = hierarchyLevels.find(level => level.hierarchyLevelName === 'Physical')
    const level2 = hierarchyLevels.find(level => level.hierarchyLevelName === 'Physical_2')
    const level3 = hierarchyLevels.find(level => level.hierarchyLevelName === 'Physical_3')
    const level4 = hierarchyLevels.find(level => level.hierarchyLevelName === 'Physical_4')
    const level5 = hierarchyLevels.find(level => level.hierarchyLevelName === 'Physical_5')

    const physicalHierarchyLevels = hierarchyLevels.filter(level => level.hierarchyLevelName.includes('Physical'));
    // console.log(physicalHierarchyLevels)
    
    return (
        <Tree
            hierarchies={physicalHierarchies}
            hierarchyLevels={physicalHierarchyLevels}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleEdit={handleEdit}
        />
    )
}

export default PhysicalTree;