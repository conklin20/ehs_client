CREATE TABLE [app].[AuditLog] (
    [Id]           INT            IDENTITY (1, 1) NOT NULL,
    [TimestampUtc] DATETIME       NOT NULL,
    [EventType]    NVARCHAR (10)  NOT NULL,
    [TableRef]     NVARCHAR (50)  NOT NULL,
    [RecordId]     INT            NOT NULL,
    [Record]       NVARCHAR (MAX) NULL,
    [UserId]       NVARCHAR (50)  NOT NULL,
    CONSTRAINT [PK_AuditLog] PRIMARY KEY CLUSTERED ([Id] ASC)
);

