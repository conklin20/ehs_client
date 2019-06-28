CREATE TABLE [app].[AppLog] (
    [AppLogId]       INT            IDENTITY (1, 1) NOT NULL,
    [Message]        NVARCHAR (MAX) NOT NULL,
    [Level]          NVARCHAR (50)  NOT NULL,
    [LoggedOn]       DATETIME2 (7)  NOT NULL,
    [AppId]          INT            NOT NULL,
    [AdditionalInfo] NVARCHAR (MAX) NULL,
    [CallSite]       NVARCHAR (50)  DEFAULT (N'') NOT NULL,
    [InnerException] NVARCHAR (MAX) NULL,
    [StackTrace]     NVARCHAR (MAX) NULL,
    [Type]           NVARCHAR (50)  DEFAULT (N'') NOT NULL,
    CONSTRAINT [PK_AppLog] PRIMARY KEY CLUSTERED ([AppLogId] ASC),
    CONSTRAINT [FK_AppLog_App_AppId] FOREIGN KEY ([AppId]) REFERENCES [app].[App] ([AppId]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_AppLog_AppId]
    ON [app].[AppLog]([AppId] ASC);

