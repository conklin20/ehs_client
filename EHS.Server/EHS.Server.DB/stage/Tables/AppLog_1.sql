CREATE TABLE [stage].[AppLog] (
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
    [StackTrace]  NVARCHAR (MAX) NULL
);

