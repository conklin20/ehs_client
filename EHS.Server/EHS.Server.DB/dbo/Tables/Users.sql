CREATE TABLE [dbo].[Users] (
    [UserId]     NVARCHAR (50)  NOT NULL,
    [Email]      NVARCHAR (255) NOT NULL,
    [FullName]   NVARCHAR (100) NOT NULL,
    [Phone]      NVARCHAR (20)  NULL,
    [RoleId]     INT            NULL,
    [TimeZone]   NVARCHAR (50)  NULL,
    [DateFormat] NVARCHAR (50)  NULL,
    [CreatedOn]  DATETIME2 (7)  NULL,
    [CreatedBy]  NVARCHAR (50)  NULL,
    [ModifiedOn] DATETIME2 (7)  NULL,
    [ModifiedBy] NVARCHAR (50)  NULL,
    [Enabled]    BIT            CONSTRAINT [DF_Users_Enabled] DEFAULT ((1)) NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([UserId] ASC)
);



