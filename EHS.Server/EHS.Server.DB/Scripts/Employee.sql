use JobPref

select p.EmplId as EmployeeId, 
	 isnull(p.[Preferred FirstName], p.FirstName) as FirstName,
	 isnull(p.[Preferred LastName], p.FirstName) as LastName,
	 cast(p.[Birth Date] as date) as BirthDate,
	 p.Sex as Sex,
	 e.ManagerID as SupervisorId, 
	 GETUTCDATE() as LastUpdatedOn,
	 j.Active as Active, 
	 e.WorkEmail as Email,
	 j.Location
from WDPersonal p
	 join WDEmp e on p.EmplId = e.EmplId 
	 join WDJobData j on j.EmplId = p.EmplId
--where [Birth Date] is null 
--where ISDATE(p.[Birth Date]) = 0 and [Birth Date] is not null
--where j.Location = 'ID01' and j.Active = 1 and p.FirstName like '%Jared%'