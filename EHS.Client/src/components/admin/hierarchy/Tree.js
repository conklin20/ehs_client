import React, { Fragment, useState, useEffect } from 'react'
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import { SvgIcon, Collapse, TextField, IconButton } from '@material-ui/core'; 
import { TreeView, TreeItem } from '@material-ui/lab'; 
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import { GOD_ROLE_LEVEL } from '../adminRoleLevel';

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
        display: 'flex',
        justifyContent: 'flex-start',
        
    },
    buttons: {
        // float: 'right'

    },
    button: {
        padding: 0
    }
  }))(props => {
    // console.log(props)
    const [isMouseInside, setIsMouseInside] = useState(false); 
    
    return (
        <span
            onMouseEnter={() => setIsMouseInside(true)}
            onMouseLeave={() => setIsMouseInside(false)}
            className={props.classes.treeItem}
        >
            <TreeItem 
                {...props} 
                TransitionComponent={TransitionComponent} 
            >
            </TreeItem>
            {isMouseInside && props.hierarchy.hierarchyLevel.hierarchyLevelNumber > 0
                ? <span className={props.classes.buttons}>
                <IconButton 
                    onClick={props.handleEdit(props.hierarchy, props.parentHierarchy)}
                    className={props.classes.button} 
                >
                    <EditIcon />
                </IconButton>
                </span>
                : <Fragment/>
            }
        </span>
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
      width: '80%',
    },
    button: {
      margin: theme.spacing(1),
    },
    newHierarchyForm: {
        display: 'flex', 
        width: '20vw',
    }
  }));

const Tree = props => {
    const classes = useStyles(); 

    const [items, setItems] = useState();

    const { hierarchies, hierarchyLevels, handleChange, handleSubmit, handleEdit, currentUser } = props;

 	// Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {
        
        if(hierarchies.length) generateTree(); 

		return () => {
			console.log('Tree Component Unmounting')
		}

    }, []); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 
    
    const generateTree = () => {

        const rootLevel = hierarchyLevels.find(l => l.hierarchyLevelNumber === 1);
        const level2 = hierarchyLevels.find(l => l.hierarchyLevelNumber === 2);
        const level3 = hierarchyLevels.find(l => l.hierarchyLevelNumber === 3);
        const level4 = hierarchyLevels.find(l => l.hierarchyLevelNumber === 4);
        const level5 = hierarchyLevels.find(l => l.hierarchyLevelNumber === 5);

        // console.log(hierarchyLevels)
        setItems((() => {
            const rootHierarchy = hierarchies.find(root => root.hierarchyLevel.hierarchyLevelNumber + 1 === 1) //hierarchyLevelNumber here is 0 based, adding 1 for clarity so it aligns with hierarchyLevels
            // console.log(rootHierarchy)
            return (
                //level 0 / root
                <StyledTreeItem 
                    id={rootHierarchy.hierarchyId}
                    nodeId={rootHierarchy.hierarchyId}
                    label={rootHierarchy.hierarchyName}
                    hierarchy={rootHierarchy}
                    handleEdit={handleEdit}
                    {...props}
                >    
                {
                    (() => {
                        return hierarchies
                            .filter(hl1 => hl1.hierarchyLevel.hierarchyLevelNumber === 1
                                && hl1.lft > rootHierarchy.lft && hl1.rgt < rootHierarchy.rgt).length
                            ? hierarchies
                            .filter(hl1 => hl1.hierarchyLevel.hierarchyLevelNumber === 1
                                && hl1.lft > rootHierarchy.lft && hl1.rgt < rootHierarchy.rgt)
                                .map((h1, i, arr) => {
                                    return (
                                        <Fragment>
                                            <StyledTreeItem 
                                                id={h1.hierarchyId}
                                                nodeId={h1.hierarchyId}
                                                label={h1.hierarchyName}
                                                hierarchy={h1}
                                                parentHierarchy={rootHierarchy}
                                                handleEdit={handleEdit}
                                                {...props}
                                            >   
                                            {
                                                (() => {
                                                    return hierarchies
                                                        .filter(hl2 => hl2.hierarchyLevel.hierarchyLevelNumber === 2
                                                            && hl2.lft > h1.lft && hl2.rgt < h1.rgt).length 
                                                        ? hierarchies
                                                            .filter(hl2 => hl2.hierarchyLevel.hierarchyLevelNumber === 2
                                                                && hl2.lft > h1.lft && hl2.rgt < h1.rgt) 
                                                            .map((h2, i, arr) => {
                                                                return (
                                                                <Fragment>
                                                                    <StyledTreeItem 
                                                                        id={h2.hierarchyId}
                                                                        nodeId={h2.hierarchyId}
                                                                        label={h2.hierarchyName}
                                                                        hierarchy={h2}
                                                                        parentHierarchy={h1}
                                                                        handleEdit={handleEdit}
                                                                        {...props}
                                                                    >   
                                                                    {
                                                                        (() => {
                                                                            return hierarchies
                                                                                .filter(h3 => h3.hierarchyLevel.hierarchyLevelNumber === 3
                                                                                    && h3.lft > h2.lft && h3.rgt < h2.rgt).length
                                                                                ? hierarchies
                                                                                    .filter(h3 => h3.hierarchyLevel.hierarchyLevelNumber === 3
                                                                                            && h3.lft > h2.lft && h3.rgt < h2.rgt)
                                                                                    .map((h3, i, arr) => {
                                                                                        return (
                                                                                        <Fragment>
                                                                                            <StyledTreeItem 
                                                                                                id={h3.hierarchyId}
                                                                                                nodeId={h3.hierarchyId}
                                                                                                label={h3.hierarchyName}
                                                                                                hierarchy={h3}
                                                                                                parentHierarchy={h2}
                                                                                                handleEdit={handleEdit}
                                                                                                {...props}
                                                                                            >   
                                                                                            {
                                                                                                (() => {
                                                                                                    return hierarchies
                                                                                                        .filter(hl4 => hl4.hierarchyLevel.hierarchyLevelNumber === 4
                                                                                                            && hl4.lft > h3.lft && hl4.rgt < h3.rgt).length ?
                                                                                                        hierarchies
                                                                                                            .filter(level4 => level4.hierarchyLevel.hierarchyLevelNumber === 4
                                                                                                                && level4.lft > h3.lft && level4.rgt < h3.rgt)
                                                                                                            .sort((a, z) => {
                                                                                                                if(a.hierarchyName < z.hierarchyName) { return -1; }
                                                                                                                if(a.hierarchyName > z.hierarchyName) { return 1; }
                                                                                                                return 0
                                                                                                            })
                                                                                                            .map((h4, i, arr) => {
                                                                                                                return (
                                                                                                                    <Fragment>
                                                                                                                        <StyledTreeItem 
                                                                                                                            id={h4.hierarchyId}
                                                                                                                            nodeId={h4.hierarchyId}
                                                                                                                            label={h4.hierarchyName}
                                                                                                                            hierarchy={h4}
                                                                                                                            parentHierarchy={h3}
                                                                                                                            handleEdit={handleEdit}
                                                                                                                            {...props}
                                                                                                                        >
                                                                                                                        </StyledTreeItem>  
                                                                                                                        {
                                                                                                                            // Form for if this is NOT the first Child of the hierarchy - PLANT/AREA
                                                                                                                            i === arr.length-1 //if last element, add text box for add new hierarchy
                                                                                                                                ?
                                                                                                                                    <form className={classes.newHierarchyForm} onSubmit={handleSubmit(h4, false, level5.hierarchyLevelId)}>
                                                                                                                                        <TextField
                                                                                                                                            id={h4.hierarchyId}
                                                                                                                                            name='newLevel5'
                                                                                                                                            placeholder={`New ${level5.hierarchyLevelAlias || level5.hierarchyLevelName} under ${h3.hierarchyName}...`}
                                                                                                                                            className={classes.textField}
                                                                                                                                            label={`New ${level5.hierarchyLevelAlias || level5.hierarchyLevelName} under ${h3.hierarchyName}...`}
                                                                                                                                            margin="normal"
                                                                                                                                            onChange={handleChange}
                                                                                                                                            // value={newHierarchy['newLevel5']}
                                                                                                                                            fullWidth
                                                                                                                                        />
                                                                                                                                        <IconButton 
                                                                                                                                            type='submit'
                                                                                                                                            className={classes.button} 
                                                                                                                                        >
                                                                                                                                            <AddCircleOutlineIcon />
                                                                                                                                        </IconButton>
                                                                                                                                    </form>
                                                                                                                                : null
                                                                                                                        }
                                                                                                                    </Fragment>  
                                                                                                                )
                                                                                                            })
                                                                                                            : 
                                                                                                            // Form for if this is the FIRST Child of the hierarchy - PLANT/AREA
                                                                                                            <form className={classes.newHierarchyForm} onSubmit={handleSubmit(h3, true, level5.hierarchyLevelId)}>
                                                                                                                <TextField
                                                                                                                    id={h3.hierarchyId}
                                                                                                                    name='newLevel5'
                                                                                                                    placeholder={`New ${level5.hierarchyLevelAlias || level5.hierarchyLevelName} under ${h3.hierarchyName}...`}
                                                                                                                    className={classes.textField}
                                                                                                                    label={`New ${level5.hierarchyLevelAlias || level5.hierarchyLevelName} under ${h3.hierarchyName}...`}
                                                                                                                    margin="normal"
                                                                                                                    onChange={handleChange}
                                                                                                                    // value={newHierarchy['newLevel5']}
                                                                                                                    fullWidth
                                                                                                                />
                                                                                                                <IconButton 
                                                                                                                    type='submit'
                                                                                                                    className={classes.button} 
                                                                                                                >
                                                                                                                    <AddCircleOutlineIcon />
                                                                                                                </IconButton>
                                                                                                            </form> 
                                                                                                })()
                                                                                            }
                                                                                            </StyledTreeItem>  
                                                                                            {
                                                                                                // Form for if this is NOT the first Child of the hierarchy - PLANT/AREA
                                                                                                i === arr.length-1 //if last element, add text box for add new hierarchy
                                                                                                    ?
                                                                                                        <form className={classes.newHierarchyForm} onSubmit={handleSubmit(h3, false, level4.hierarchyLevelId)}>
                                                                                                            <TextField
                                                                                                                id={h3.hierarchyId}
                                                                                                                name='newLevel4'
                                                                                                                placeholder={`New ${level4.hierarchyLevelAlias || level4.hierarchyLevelName} under ${h2.hierarchyName}...`}
                                                                                                                className={classes.textField}
                                                                                                                label={`New ${level4.hierarchyLevelAlias || level4.hierarchyLevelName} under ${h2.hierarchyName}...`}
                                                                                                                margin="normal"
                                                                                                                onChange={handleChange}
                                                                                                                fullWidth
                                                                                                            />
                                                                                                            <IconButton 
                                                                                                                type='submit'
                                                                                                                className={classes.button} 
                                                                                                            >
                                                                                                                <AddCircleOutlineIcon />
                                                                                                            </IconButton>
                                                                                                        </form>
                                                                                                    : null
                                                                                            }
                                                                                        </Fragment>
                                                                                        )
                                                                                    })
                                                                                    : 
                                                                                    // Form for if this is the FIRST Child of the hierarchy - PLANT/AREA
                                                                                    <form className={classes.newHierarchyForm} onSubmit={handleSubmit(h2, true, level4.hierarchyLevelId)}>
                                                                                        <TextField
                                                                                            id={h2.hierarchyId}
                                                                                            name='newLevel4'
                                                                                            placeholder={`New ${level4.hierarchyLevelAlias || level4.hierarchyLevelName} under ${h2.hierarchyName}...`}
                                                                                            className={classes.textField}
                                                                                            label={`New ${level4.hierarchyLevelAlias || level4.hierarchyLevelName} under ${h2.hierarchyName}...`}
                                                                                            margin="normal"
                                                                                            onChange={handleChange}
                                                                                            fullWidth
                                                                                        />
                                                                                        <IconButton 
                                                                                            type='submit'
                                                                                            className={classes.button} 
                                                                                        >
                                                                                            <AddCircleOutlineIcon />
                                                                                        </IconButton>
                                                                                    </form> 
                                                                            })()
                                                                    }
                                                                    </StyledTreeItem> 
                                                                    {
                                                                        // Form for if this is NOT the first Child of the hierarchy - SITE/SITE
                                                                        i === arr.length-1 && currentUser.user.roleLevel == GOD_ROLE_LEVEL//if last element, add text box for add new hierarchy
                                                                            ?
                                                                                <form className={classes.newHierarchyForm} onSubmit={handleSubmit(h2, false, level3.hierarchyLevelId)}>
                                                                                    <TextField
                                                                                        id={h2.hierarchyId}
                                                                                        name='newLevel3'
                                                                                        placeholder={`New ${level3.hierarchyLevelAlias || level3.hierarchyLevelName} under ${h1.hierarchyName}...`}
                                                                                        className={classes.textField}
                                                                                        label={`New ${level3.hierarchyLevelAlias || level3.hierarchyLevelName} under ${h1.hierarchyName}...`}
                                                                                        margin="normal"
                                                                                        onChange={handleChange}
                                                                                        fullWidth
                                                                                    />
                                                                                    <IconButton 
                                                                                        type='submit'
                                                                                        className={classes.button} 
                                                                                    >
                                                                                        <AddCircleOutlineIcon />
                                                                                    </IconButton>
                                                                                </form>
                                                                            : null
                                                                    }
                                                                </Fragment>
                                                            )
                                                        })
                                                        : 
                                                        currentUser.user.roleLevel == GOD_ROLE_LEVEL ?
                                                        // Form for if this is the FIRST Child of the hierarchy - SITE/SITE
                                                        <form className={classes.newHierarchyForm} onSubmit={handleSubmit(h1, true, level3.hierarchyLevelId)}>
                                                            <TextField
                                                                id={h1.hierarchyId}
                                                                name='newLevel3'
                                                                placeholder={`New ${level3.hierarchyLevelAlias || level3.hierarchyLevelName} under ${h1.hierarchyName}...`}
                                                                className={classes.textField}
                                                                label={`New ${level3.hierarchyLevelAlias || level3.hierarchyLevelName} under ${h1.hierarchyName}...`}
                                                                margin="normal"
                                                                onChange={handleChange}
                                                                fullWidth
                                                            />
                                                            <IconButton 
                                                                type='submit'
                                                                className={classes.button} 
                                                            >
                                                                <AddCircleOutlineIcon />
                                                            </IconButton>
                                                        </form> 
                                                        : null
                                                })()
                                            }
                                            </StyledTreeItem>
                                            {
                                                // Form for if this is NOT the first Child of the hierarchy - REGION/DIVISION
                                                i === arr.length-1 && currentUser.user.roleLevel == GOD_ROLE_LEVEL //if last element, add text box for add new hierarchy
                                                    ?
                                                        <form className={classes.newHierarchyForm} onSubmit={handleSubmit(h1, false, level2.hierarchyLevelId)}>
                                                            <TextField
                                                                id={h1.hierarchyId}
                                                                name='newLevel2'
                                                                placeholder={`New ${level2.hierarchyLevelAlias || level2.hierarchyLevelName} under ${rootHierarchy.hierarchyName}...`}
                                                                className={classes.textField}
                                                                label={`New ${level2.hierarchyLevelAlias || level2.hierarchyLevelName} under ${rootHierarchy.hierarchyName}...`}
                                                                margin="normal"
                                                                onChange={handleChange}
                                                                fullWidth
                                                            />
                                                            <IconButton 
                                                                type='submit'
                                                                className={classes.button} 
                                                            >
                                                                <AddCircleOutlineIcon />
                                                            </IconButton>
                                                        </form>
                                                    : null
                                            }
                                        </Fragment>
                                    )
                                })
                            : 
                            currentUser.user.roleLevel == GOD_ROLE_LEVEL ?
                            // Form for if this is the FIRST Child of the hierarchy - REGION/DIVISON
                            <form className={classes.newHierarchyForm} onSubmit={handleSubmit(rootHierarchy, true, level2.hierarchyLevelId)}>
                                <TextField
                                    id={rootHierarchy.hierarchyId}
                                    name='newLevel2'
                                    placeholder={`New ${level2.hierarchyLevelAlias || level2.hierarchyLevelName} under ${rootHierarchy.hierarchyName}...`}
                                    className={classes.textField}
                                    label={`New ${level2.hierarchyLevelAlias || level2.hierarchyLevelName} under ${rootHierarchy.hierarchyName}...`}
                                    margin="normal"
                                    onChange={handleChange}
                                    fullWidth
                                />
                                <IconButton 
                                    type='submit'
                                    className={classes.button} 
                                >
                                    <AddCircleOutlineIcon />
                                </IconButton>
                            </form> 
                            : null 
                    })()
                }
                </StyledTreeItem>  //root end 
            )
        })()
    )}

    return (
        <TreeView
            className={classes.tree}
            defaultExpanded={hierarchies.map(i => i.hierarchyId)} 
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<CloseSquare />}
        >
            {items}
        </TreeView>
    )
}

export default Tree;