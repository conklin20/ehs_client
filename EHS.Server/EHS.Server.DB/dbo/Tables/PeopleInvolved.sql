CREATE TABLE [dbo].[PeopleInvolved] (
    [PeopleInvolvedId] INT             IDENTITY (1, 1) NOT NULL,
    [RoleId]           INT             NOT NULL,
    [EventId]          INT             NOT NULL,
    [EmployeeId]       NVARCHAR (MAX)  NULL,
    [Comments]         NVARCHAR (2000) NULL,
    CONSTRAINT [PK_PeopleInvolved] PRIMARY KEY CLUSTERED ([PeopleInvolvedId] ASC)
);

