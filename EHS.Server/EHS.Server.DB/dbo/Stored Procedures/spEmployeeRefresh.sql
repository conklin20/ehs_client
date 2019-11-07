-- =============================================
-- Author:		CC
-- Create date: 9/26/2019
-- Description:	Updates the Employees table from source (WorkDay/JobPref db) 
-- =============================================
CREATE PROCEDURE dbo.spEmployeeRefresh

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	if OBJECT_ID('tempdb..#WDEmployeeImport') is not null 
	drop table #WDEmployeeImport

	create table #WDEmployeeImport
	(
		[EmployeeId] [nvarchar](50) NOT NULL,
		[FirstName] [nvarchar](100) NOT NULL,
		[LastName] [nvarchar](100) NOT NULL,
		[BirthDate] [date] NULL,
		[Sex] [nvarchar](15) NULL,
		[SupervisorId] [nvarchar](50) NULL,
		[LastUpdatedOn] [datetime2](7) NOT NULL,
		--[POET] [bit] NULL,
		[Active] [bit] NOT NULL,
		[Email] [nvarchar](100) NULL,
		[Location] [nvarchar](50) NULL
	 CONSTRAINT [PK_Employees_tmp] PRIMARY KEY CLUSTERED 
	(
		[EmployeeId] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]

	BULK INSERT #WDEmployeeImport
	FROM 'C:\Users\caryc\Projects\Vista Outdoor\EHS\WDEmployeeExtract.txt'
	WITH 
	(
		FIRSTROW = 2, 
		FIELDTERMINATOR = '|'
		--ROWTERMINATOR = '0x0a'
	)

	--merge statement to insert new records or update existing 
	merge dbo.Employees with (updlock, rowlock) t
	using 
		(
			select EmployeeId, FirstName, LastName, BirthDate, Sex, SupervisorId, LastUpdatedOn, Active, Email, [Location]
			from #WDEmployeeImport 
		) s 
		on t.EmployeeId = s.EmployeeId
	when matched then 
		update 
		set t.FirstName = s.FirstName, 
			t.LastName = s.LastName, 
			t.BirthDate = s.BirthDate, 
			t.Sex = s.Sex, 
			t.SupervisorId = s.SupervisorId, 
			t.LastUpdatedOn = getutcdate(),
			t.Active = s.Active,
			t.Email = s.Email, 
			t.[HierarchyId] = case when [Location] = 'ID01' then 4001 -- Lewiston
								   else null end
	when not matched then 
		insert (EmployeeId
				, FirstName
				, LastName
				, BirthDate
				, Sex
				, SupervisorId
				, LastUpdatedOn
				, Active
				, Email
				, [HierarchyId])  
		values (s.EmployeeId
				, s.FirstName
				, s.LastName
				, s.BirthDate
				, s.Sex
				, s.SupervisorId
				, getutcdate()
				, s.Active
				, s.Email
				, case when [Location] = 'ID01' then 4001 -- Lewiston
								   else null end   );

	--set the IsSupervisor bit 
	update s
	set s.IsSupervisor = 1 
	from Employees e 
		 join Employees s on e.SupervisorId = s.EmployeeId
	where s.Active = 1


	select * from Employees e --where e.EmployeeId = 71624

END