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

    const { physicalHierarchies, hierarchyLevels, handleChange, handleSubmit, handleEdit, currentUser } = props;
      
    const physicalHierarchyLevels = hierarchyLevels.filter(level => level.hierarchyLevelName.includes('Physical'));
    // console.log(physicalHierarchyLevels)
    
    return (
        <Tree
            hierarchies={physicalHierarchies}
            hierarchyLevels={physicalHierarchyLevels}
            {...props}
        />
    )
}

export default PhysicalTree;