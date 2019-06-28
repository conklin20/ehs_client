CREATE TABLE [app].[App] (
    [AppId]   INT           IDENTITY (1, 1) NOT NULL,
    [AppName] NVARCHAR (50) NOT NULL,
    [Active]  BIT           NOT NULL,
    CONSTRAINT [PK_App] PRIMARY KEY CLUSTERED ([AppId] ASC)
);

