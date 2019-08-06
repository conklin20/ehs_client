CREATE TABLE [dbo].[Actions] (
    [ActionId]       INT            IDENTITY (1, 1) NOT NULL,
    [EventId]        INT            NOT NULL,
    [EventType]      NVARCHAR (50)  NOT NULL,
    [AssignedTo]     NVARCHAR (50)  NULL,
    [ActionToTake]   NVARCHAR (MAX) NOT NULL,
    [ActionType]     NVARCHAR (50)  NOT NULL,
    [DueDate]        DATETIME2 (7)  NOT NULL,
    [CompletionDate] DATETIME2 (7)  NULL,
    [ApprovalDate]   DATETIME2 (7)  NULL,
    [CreatedOn]      DATETIME2 (7)  NOT NULL,
    [CreatedBy]      NVARCHAR (50)  NOT NULL,
    [ModifiedOn]     DATETIME2 (7)  NOT NULL,
    [ModifiedBy]     NVARCHAR (50)  NOT NULL,
    CONSTRAINT [PK_Actions] PRIMARY KEY CLUSTERED ([ActionId] ASC)
);



