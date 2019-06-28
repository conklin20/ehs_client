CREATE TABLE [dbo].[Employees] (
    [EmployeeId]    NVARCHAR (50)  NOT NULL,
    [FirstName]     NVARCHAR (100) NOT NULL,
    [LastName]      NVARCHAR (100) NOT NULL,
    [BirthDate]     DATETIME2 (7)  NOT NULL,
    [Sex]           NVARCHAR (15)  NOT NULL,
    [SupervisorId]  NVARCHAR (50)  NULL,
    [LastUpdatedOn] DATETIME2 (7)  NOT NULL,
    [POET]          BIT            DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_Employees] PRIMARY KEY CLUSTERED ([EmployeeId] ASC),
    CONSTRAINT [FK_Employees_Employees_SupervisorId] FOREIGN KEY ([SupervisorId]) REFERENCES [dbo].[Employees] ([EmployeeId])
);


GO
CREATE NONCLUSTERED INDEX [IX_Employees_SupervisorId]
    ON [dbo].[Employees]([SupervisorId] ASC);

