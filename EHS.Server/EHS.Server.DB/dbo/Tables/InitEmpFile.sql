CREATE TABLE [dbo].[InitEmpFile] (
    [EmployeeId]    NVARCHAR (50)  NULL,
    [FirstName]     NVARCHAR (100) NULL,
    [LastName]      NVARCHAR (100) NULL,
    [BirthDate]     DATE           NULL,
    [Sex]           NVARCHAR (15)  NULL,
    [SupervisorId]  NVARCHAR (50)  NULL,
    [LastUpdatedOn] DATETIME2 (7)  NULL,
    [Active]        BIT            NULL,
    [Email]         NVARCHAR (100) NULL
);

