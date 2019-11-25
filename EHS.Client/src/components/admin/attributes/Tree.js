import React, { Fragment, useState, useEffect } from 'react'
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import { SvgIcon, Collapse, TextField, IconButton } from '@material-ui/core'; 
import SwapVertIcon from '@material-ui/icons/SwapVert';
import LockIcon from '@material-ui/icons/Lock';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import { TreeView, TreeItem } from '@material-ui/lab'; 
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import { GOD_ROLE_LEVEL } from '../adminRoleLevel';
import { ATTR_CATS } from '../../../helpers/attributeCategoryEnum';

const MinusSquare = props => {
    return (
      <SvgIcon fontSize="inherit" {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
      </SvgIcon>
    );
  }
  
const PlusSquare = props => {
    return (
        <SvgIcon fontSize="inherit" {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
    );
}

const CloseSquare = props => {
    return (
        <SvgIcon className="close" fontSize="inherit" {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
        </SvgIcon>
    );
}

function TransitionComponent(props) {
    const style = useSpring({
      from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
      to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
    });
  
    return (
        <animated.div style={style}>
            <Collapse {...props} />
        </animated.div>
    );
  }

const StyledTreeItem = withStyles(theme => ({
    iconContainer: {
      '& .close': {
        opacity: 0.3,
      },
      justifyContent: 'flex-start'
    },
    group: {
      marginLeft: 12,
      paddingLeft: 12,
      borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
    treeItem: {
        // display: 'flex',
        // justifyContent: 'space-between',
        width: '40vw',
    },
    buttons: {
        // float: 'right'

    },
    button: {
        padding: 0
    },
  }))(props => {
    const { classes, keyHierarchyAttributes, hierarchy, cat, handleChange, handleSubmit, handleEdit } = props
    const [isMouseInside, setIsMouseInside] = useState(false); 
    
    return (
        <div className={classes.treeItem}>
            <TreeItem 
                {...props} 
                TransitionComponent={TransitionComponent}
                
            >
            </TreeItem>
            {keyHierarchyAttributes ?
                <ul className={classes.existingHAs}>
                    {keyHierarchyAttributes.map(kha => 
                        <li
                            className={classes.li}
                            onMouseEnter={() => setIsMouseInside(true)}
                            onMouseLeave={() => setIsMouseInside(false)}
                        >   
                            {kha.value}
                            {isMouseInside 
                                ? 
                                    <IconButton 
                                        onClick={handleEdit(kha)}
                                        className={props.classes.button} 
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton> 
                                : <Fragment /> 
                            }
                        </li>
                    )}                                                            
                    { !cat.single && !cat.locked ?
                        <form className={classes.newAttributeForm} onSubmit={handleSubmit(cat, hierarchy)}>
                            <TextField 
                                fullWidth 
                                id={cat.key}
                                name={cat.key}
                                placeholder={`Copy/Paste new ${cat.key} under ${hierarchy.hierarchyName}`}
                                onChange={handleChange}
                            ></TextField>
                            <IconButton 
                                type='submit'
                                className={classes.button} 
                            >
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </form>
                        : null
                    }
                </ul>            
            : null }
        </div>
    )
  });
  
const useStyles = makeStyles(theme => ({
    tree: {
        // height: 264,
        flexGrow: 1,
        textAlign: 'left',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginTop: 0,
    },
    button: {
      margin: theme.spacing(1),
    },
    existingHAs: {
        minWidth: '40vw',
    },
    li: {
        margin: 0,
        padding: 0, 
        height: '1.5em',
    },
    newAttributeForm: {
        display: 'flex', 
        width: '40vw',
        marginTop: theme.spacing(2),
    }
  }));

const Tree = props => {
    const classes = useStyles(); 

    const [items, setItems] = useState();

    // //For the global mouse inside events only. Logical/Physical mouse event is inside the StylesListItem
    // const [isMouseInside, setIsMouseInside] = useState(false); 

    const { treeType, hierarchyAttributes, hierarchies, hierarchyLevels, handleChange, handleEdit, handleSubmit, currentUser } = props;

 	// Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {
        
        if(hierarchyAttributes.length) generateTree(); 

		return () => {
			console.log('Tree Component Unmounting')
		}

    }, [hierarchyAttributes]); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 
    
    const generateTree = () => {

        const attributeCategories = Object.keys(ATTR_CATS).map(cat => ATTR_CATS[cat])


        
        // console.log(hierarchyLevels)
        const level1 = hierarchyLevels ?  hierarchyLevels.find(l => l.hierarchyLevelNumber === 1) : null;
        const level2 = hierarchyLevels ?  hierarchyLevels.find(l => l.hierarchyLevelNumber === 2) : null;
        const level3 = hierarchyLevels ?  hierarchyLevels.find(l => l.hierarchyLevelNumber === 3) : null;
        const level4 = hierarchyLevels ?  hierarchyLevels.find(l => l.hierarchyLevelNumber === 4) : null;
        const level5 = hierarchyLevels ?  hierarchyLevels.find(l => l.hierarchyLevelNumber === 5) : null;
        // console.log(rootLevel, level2, level3, level4, level5)

        setItems((() => {
            if(treeType === 'Global'){
                return (
                    attributeCategories
                        .filter(cat => cat.hierarchy === treeType)
                        .map(cat =>{
                        return (
                            <StyledTreeItem 
                                id={cat.key}
                                nodeId={cat.key}
                                label={
                                    <Fragment>
                                        <strong>{cat.key}</strong>
                                        {cat.locked ?  <LockIcon fontSize="small" /> : null }
                                    </Fragment>
                                }
                                // {...props}
                            >
                            {
                                (() => {
                                    return (
                                        <ul className={classes.existingHAs}>
                                            {
                                                hierarchyAttributes
                                                .filter(ha => ha.key === cat.key)
                                                .map(ha => {
                                                    return (                                                 
                                                        <li className={classes.li}>
                                                            {ha.value}
                                                            {!cat.locked
                                                                ?
                                                                    <IconButton 
                                                                        onClick={handleEdit(ha)}
                                                                        // className={props.classes.button} 
                                                                    >
                                                                        <EditIcon fontSize="small" />
                                                                    </IconButton> 
                                                                : null
                                                            }                                                            
                                                        </li>
                                                    )
                                                })
                                            }
                                            { !cat.single && !cat.locked ?
                                                <form className={classes.newAttributeForm} onSubmit={handleSubmit(cat, hierarchyAttributes[0])}>
                                                    <TextField 
                                                        fullWidth 
                                                        id={cat.key}
                                                        name={cat.key}
                                                        placeholder={`Copy/Paste new Global ${cat.key}`}
                                                        onChange={handleChange}
                                                        handleSubmit={handleSubmit}
                                                        handleEdit={handleEdit}
                                                    ></TextField>
                                                    <IconButton 
                                                        type='submit'
                                                        className={classes.button} 
                                                    >
                                                        <AddCircleOutlineIcon />
                                                    </IconButton>
                                                </form>
                                                : null 
                                            }
                                        </ul>
                                    )
                                })()
                            }
                            </StyledTreeItem>
                        )
                    })
                )

            } else {
                return (
                    attributeCategories
                        .filter(cat => cat.hierarchy === treeType)
                        .map(cat =>{
                            return (
                                <StyledTreeItem 
                                    id={cat.key}
                                    nodeId={cat.key}
                                    label={
                                        <strong>{cat.key}</strong>
                                    }
                                    classes={classes}
                                    keyHierarchyAttributes={null}
                                    hierarchy={null}
                                    cat={cat}
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                    handleEdit={handleEdit}
                                >
                                    {
                                        (() => {
                                            return hierarchies
                                                .filter(h => h.hierarchyLevel.hierarchyLevelNumber === level1.hierarchyLevelNumber) //Level 1
                                                .map((h1, i) => {
                                                    const keyHierarchyAttributes = hierarchyAttributes.filter(ha => ha.key === cat.key && ha.hierarchyId === h1.hierarchyId)
                                                    return (
                                                        <Fragment>
                                                            <StyledTreeItem
                                                                id={`${cat.key}-${h1.hierarchyId}`}
                                                                nodeId={`${cat.key}-${h1.hierarchyId}`}
                                                                label={
                                                                    <Fragment>
                                                                        <strong>{h1.hierarchyName}</strong>
                                                                        {cat.locked ?  <LockIcon fontSize="small" /> : null }
                                                                    </Fragment>
                                                                }
                                                                classes={classes}
                                                                keyHierarchyAttributes={keyHierarchyAttributes}
                                                                hierarchy={h1}
                                                                cat={cat}
                                                                handleChange={handleChange}
                                                                handleSubmit={handleSubmit}
                                                                handleEdit={handleEdit}
                                                            >
                                                            {
                                                                (() => {
                                                                    return hierarchies
                                                                        .filter(h => h.hierarchyLevel.hierarchyLevelNumber === level2.hierarchyLevelNumber 
                                                                                && h.lft > h1.lft && h.rgt < h1.rgt) //Level 2
                                                                        .map((h2, i) => {
                                                                            const keyHierarchyAttributes = hierarchyAttributes.filter(ha => ha.key === cat.key && ha.hierarchyId === h2.hierarchyId)
                                                                            return (
                                                                                <Fragment>
                                                                                    <StyledTreeItem
                                                                                        id={`${cat.key}-${h2.hierarchyId}`}
                                                                                        nodeId={`${cat.key}-${h2.hierarchyId}`}
                                                                                        label={
                                                                                            <Fragment>
                                                                                                <strong>{h2.hierarchyName}</strong>
                                                                                                {cat.locked ?  <LockIcon fontSize="small" /> : null }
                                                                                            </Fragment>
                                                                                        }
                                                                                        classes={classes}
                                                                                        keyHierarchyAttributes={keyHierarchyAttributes}
                                                                                        hierarchy={h2}
                                                                                        cat={cat}
                                                                                        handleChange={handleChange}
                                                                                        handleSubmit={handleSubmit}
                                                                                        handleEdit={handleEdit}
                                                                                    >
                                                                                    {
                                                                                        (() => {
                                                                                            return hierarchies
                                                                                                .filter(h => h.hierarchyLevel.hierarchyLevelNumber === level3.hierarchyLevelNumber
                                                                                                    && h.lft > h2.lft && h.rgt < h2.rgt) //Level 3
                                                                                                .map(h3=> {
                                                                                                    const keyHierarchyAttributes = hierarchyAttributes.filter(ha => ha.key === cat.key && ha.hierarchyId === h3.hierarchyId)
                                                                                                    return (
                                                                                                        <Fragment>
                                                                                                            <StyledTreeItem
                                                                                                                id={`${cat.key}-${h3.hierarchyId}`}
                                                                                                                nodeId={`${cat.key}-${h3.hierarchyId}`}
                                                                                                                label={
                                                                                                                    <Fragment>
                                                                                                                        <strong>{h3.hierarchyName}</strong>
                                                                                                                        {cat.locked ?  <LockIcon fontSize="small" /> : null }
                                                                                                                    </Fragment>
                                                                                                                }
                                                                                                                classes={classes}
                                                                                                                keyHierarchyAttributes={keyHierarchyAttributes}
                                                                                                                hierarchy={h3}
                                                                                                                cat={cat}
                                                                                                                handleChange={handleChange}
                                                                                                                handleSubmit={handleSubmit}
                                                                                                                handleEdit={handleEdit}
                                                                                                            >
                                                                                                            {
                                                                                                                (() => {
                                                                                                                    return hierarchies
                                                                                                                        .filter(h => h.hierarchyLevel.hierarchyLevelNumber === level4.hierarchyLevelNumber
                                                                                                                            && h.lft > h3.lft && h.rgt < h3.rgt) //Level 4
                                                                                                                        .map(h4 => {
                                                                                                                            const keyHierarchyAttributes = hierarchyAttributes.filter(ha => ha.key === cat.key && ha.hierarchyId === h4.hierarchyId)
                                                                                                                            return (
                                                                                                                                <Fragment>
                                                                                                                                    <StyledTreeItem
                                                                                                                                        id={`${cat.key}-${h4.hierarchyId}`}
                                                                                                                                        nodeId={`${cat.key}-${h4.hierarchyId}`}
                                                                                                                                        label={
                                                                                                                                            <Fragment>
                                                                                                                                                <strong>{h4.hierarchyName}</strong>
                                                                                                                                                {cat.locked ?  <LockIcon fontSize="small" /> : null }
                                                                                                                                            </Fragment>
                                                                                                                                        }
                                                                                                                                        classes={classes}
                                                                                                                                        keyHierarchyAttributes={keyHierarchyAttributes}
                                                                                                                                        hierarchy={h4}
                                                                                                                                        cat={cat}
                                                                                                                                        handleChange={handleChange}
                                                                                                                                        handleSubmit={handleSubmit}
                                                                                                                                        handleEdit={handleEdit}
                                                                                                                                    >
                                                                                                                                    {
                                                                                                                                        (() => {
                                                                                                                                            return hierarchies
                                                                                                                                                .filter(h => h.hierarchyLevel.hierarchyLevelNumber === level5.hierarchyLevelNumber
                                                                                                                                                    && h.lft > h4.lft && h.rgt < h4.rgt) //Level 5
                                                                                                                                                .map(h5 => {
                                                                                                                                                    const keyHierarchyAttributes = hierarchyAttributes.filter(ha => ha.key === cat.key && ha.hierarchyId === h5.hierarchyId)
                                                                                                                                                    return (
                                                                                                                                                        <Fragment>
                                                                                                                                                            <StyledTreeItem
                                                                                                                                                                id={`${cat.key}-${h5.hierarchyId}`}
                                                                                                                                                                nodeId={`${cat.key}-${h5.hierarchyId}`}
                                                                                                                                                                label={
                                                                                                                                                                    <Fragment>
                                                                                                                                                                        <strong>{h5.hierarchyName}</strong>
                                                                                                                                                                        {cat.locked ?  <LockIcon fontSize="small" /> : null }
                                                                                                                                                                    </Fragment>
                                                                                                                                                                }
                                                                                                                                                                classes={classes}
                                                                                                                                                                keyHierarchyAttributes={keyHierarchyAttributes}
                                                                                                                                                                hierarchy={h5}
                                                                                                                                                                cat={cat}
                                                                                                                                                                handleChange={handleChange}
                                                                                                                                                                handleSubmit={handleSubmit}
                                                                                                                                                                handleEdit={handleEdit}
                                                                                                                                                            >
                                                                                                                                                            </StyledTreeItem>
                                                                                                                                                        </Fragment>
                                                                                                                                                    )
                                                                                                                                                })
                                                                                                                                        })()
                                                                                                                                    }
                                                                                                                                    </StyledTreeItem>
                                                                                                                                </Fragment>
                                                                                                                            )
                                                                                                                        })
                                                                                                                })()
                                                                                                            }
                                                                                                            </StyledTreeItem>
                                                                                                        </Fragment>
                                                                                                    )
                                                                                                })
                                                                                        })()
                                                                                    }
                                                                                    </StyledTreeItem>
                                                                                </Fragment>
                                                                            )
                                                                        })
                                                                })()
                                                            }
                                                            </StyledTreeItem>
                                                        </Fragment>
                                                    )
                                                })
                                        })()
                                    }
                                </StyledTreeItem>
                            )
                    })
                )
            }
        })()
    )}

    return (
        <TreeView
            className={classes.tree}
            defaultExpanded={hierarchyAttributes.map(ha => ha.hierarchyAttributeId)} 
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<CloseSquare />}        
        >
            {items}
        </TreeView>
    )
}

export default Tree;