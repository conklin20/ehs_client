import React, {  } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Tree from './Tree';
  
const useStyles = makeStyles(theme => ({
    tree: {
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

const LogicalTree = props => {
    const classes = useStyles(); 

    const { logicalHierarchies, hierarchyLevels, handleChange, handleSubmit, handleEdit, currentUser } = props;
        
    const logicalHierarchyLevels = hierarchyLevels.filter(level => level.hierarchyLevelName.includes('Logical'));
    // console.log(logicalHierarchyLevels)

    return (
        <Tree
            hierarchies={logicalHierarchies}
            hierarchyLevels={logicalHierarchyLevels}
            {...props}
        />
    )
}

export default LogicalTree;