CREATE TYPE [dbo].[PeopleInvolvedTableType] AS TABLE (
    [RoleId]     INT            NOT NULL,
    [EventId]    INT            NOT NULL,
    [EmployeeId] NVARCHAR (50)  NOT NULL,
    [Comments]   NVARCHAR (MAX) NULL);

