
export default function filterEmployeeListById(employees, value, hierarchyId, active, sups) {
    //if this was an existing incident, grab the employee record, since they could be inactive now

    const selectedEmployee = value && employees.some(e => e.employeeId === value) ? 
        {
            value: employees.find(e => e.employeeId === value).employeeId,
            label: `${employees.find(e => e.employeeId === value).fullName} (${employees.find(e => e.employeeId === value).employeeId})`, 
            selected: true,
        } : 
        {            
            value: value,
            label: `Employee Not Found (${value})`, 
            selected: true,
        }
    
    // let employeeList = selectedEmployee ? [selectedEmployee, ...employees] : employees

    let employeeList = employees
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
            selected: false
        }));

    // console.log(selectedEmployee, employeeList)
    return selectedEmployee ? [selectedEmployee, ...employeeList] : employeeList
}