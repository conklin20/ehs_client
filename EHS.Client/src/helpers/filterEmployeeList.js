
export default function filterEmployeeListById(employees, value, hierarchyId, active, sups) {
    //if this was an existing incident, grab the employee record, since they could be inactive now

    const selectedEmployee = value ? employees.filter(e => e.employeeId === value)[0] : null
    // console.log(selectedEmployee)
    //insert at the beginning of the array 
    
    let employeeList = selectedEmployee ? [selectedEmployee, ...employees] : employees

    return employeeList
        .filter(e => {
            return e.hierarchyId === hierarchyId
        })
        .filter(e => {
            if(active) return e.active === true
            else return e
        })
        .filter(e => {
            if(sups) return e.isSupervisor === true
            else return e
        })
        .map((e, i) => ({
            value: e.employeeId, 
            label: `${e.fullName} (${e.employeeId})`, 
            selected: i === 0 ? true : false
        }));
}

// export default function filterEmployeeListByName(employees, value) {
//     console.log(employees, value)
//     //if this was an existing incident, grab the employee record, since they could be inactive now

//     return employees
//         .filter(e => e.Active === true)
//         .map(e => ({
//             value: e.fullName, 
//             label: `${e.fullName} (${e.employeeId})`, 
//             selected: e.value === value ? true : false
//         }));
// }