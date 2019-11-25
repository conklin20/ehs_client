CREATE TABLE [app].[AppLog] (
    [AppLogId]    INT            IDENTITY (1, 1) NOT NULL,
    [AppId]       INT            NOT NULL,
    [Level]       NVARCHAR (50)  NULL,
    [Logger]      NVARCHAR (255) NULL,
    [UserName]    NVARCHAR (255) NULL,
    [MachineName] NVARCHAR (255) NULL,
    [LoggedOn]    DATETIME2 (7)  NULL,
    [Thread]      NVARCHAR (50)  NULL,
    [Message]     NVARCHAR (MAX) NULL,
    [CallSite]    NVARCHAR (MAX) NULL,
    [Exception]   NVARCHAR (MAX) NULL,
    [StackTrace]  NVARCHAR (MAX) NULL,
    [FromSweeper] BIT            CONSTRAINT [DF_AppLog_FromSweeper] DEFAULT ((0)) NULL,
    [InsertDate]  DATETIME2 (7)  CONSTRAINT [DF_AppLog_InsertDate] DEFAULT (sysutcdatetime()) NULL,
    CONSTRAINT [PK_AppLog] PRIMARY KEY CLUSTERED ([AppLogId] ASC),
    CONSTRAINT [FK_AppLog_App_AppId] FOREIGN KEY ([AppId]) REFERENCES [app].[App] ([AppId]) ON DELETE CASCADE
);






GO


