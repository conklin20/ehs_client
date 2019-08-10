// import { apiCall } from '../../services/api'; 
// import { addError } from './errors'; 
// import { 
//     LOAD_LOGICAL_HIERARCHIES, 
//     LOAD_PHYSICAL_HIERARCHIES,
//     LOAD_LOGICAL_HIERARCHY_ATTRIBUTES, 
//     LOAD_PHYSICAL_HIERARCHY_ATTRIBUTES 
// } from '../actionTypes'; 

// export const loadFullLogicalTree = logicalHierarchies => ({
//     type: LOAD_LOGICAL_HIERARCHIES, 
//     logicalHierarchies
// }); 

// export const loadFullPhysicalTree = physicalHierarchies => ({
//     type: LOAD_PHYSICAL_TREE, 
//     physicalHierarchies
// }); 

// export const fetchLogicalHierarchyTree = () => {
//     return dispatch => {
//         return apiCall('get', '/hierarchies/leafnodes/department') //+ hierachyId)
//             .then(res => {
//                 dispatch(loadFullLogicalTree(res)); 
//             })
//             .catch(err => {
//                 console.log(err)
//                 dispatch(addError(err || 'An unknown error has occured.')); 
//             });
//     }
// }

// export const fetchPhysicalHierarchyTree = () => {
//     return dispatch => {
//         return apiCall('get', '/hierarchies/leafnodes/plantarea') //+ hierachyId)
//             .then(res => {
//                 dispatch(loadFullPhysicalTree(res)); 
//             })
//             .catch(err => {
//                 console.log(err)
//                 dispatch(addError(err || 'An unknown error has occured.')); 
//             });
//     }
// }