CREATE TABLE [dbo].[Users] (
    [UserId]     NVARCHAR (50)  NOT NULL,
    [Email]      NVARCHAR (MAX) NOT NULL,
    [Password]   NVARCHAR (MAX) NOT NULL,
    [FullName]   NVARCHAR (100) NOT NULL,
    [Phone]      NVARCHAR (MAX) NULL,
    [RoleId]     INT            NOT NULL,
    [TimeZone]   NVARCHAR (50)  NOT NULL,
    [DateFormat] NVARCHAR (50)  NOT NULL,
    [ModifiedOn] DATETIME2 (7)  NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([UserId] ASC)
);

