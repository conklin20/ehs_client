CREATE TABLE [dbo].[UserRoles] (
    [UserRoleId]       INT            IDENTITY (1, 1) NOT NULL,
    [RoleName]         NVARCHAR (50)  NOT NULL,
    [RoleCapabilities] NVARCHAR (255) NOT NULL,
    [RoleLevel]        SMALLINT       NOT NULL,
    CONSTRAINT [PK_UserRoles] PRIMARY KEY CLUSTERED ([UserRoleId] ASC)
);



