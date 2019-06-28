CREATE TABLE [dbo].[ApprovalRoutings] (
    [ApprovalRoutingId] INT           IDENTITY (1, 1) NOT NULL,
    [SeverityId]        INT           NOT NULL,
    [UserRoleId]        INT           NOT NULL,
    [ApprovalLevelName] NVARCHAR (50) NOT NULL,
    [ApprovalLevel]     INT           NOT NULL,
    [Enabled]           BIT           NOT NULL,
    CONSTRAINT [PK_ApprovalRoutings] PRIMARY KEY CLUSTERED ([ApprovalRoutingId] ASC),
    CONSTRAINT [FK_ApprovalRoutings_Severities_SeverityId] FOREIGN KEY ([SeverityId]) REFERENCES [dbo].[Severities] ([SeverityId]) ON DELETE CASCADE,
    CONSTRAINT [FK_ApprovalRoutings_UserRoles_UserRoleId] FOREIGN KEY ([UserRoleId]) REFERENCES [dbo].[UserRoles] ([UserRoleId]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_ApprovalRoutings_UserRoleId]
    ON [dbo].[ApprovalRoutings]([UserRoleId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_ApprovalRoutings_SeverityId]
    ON [dbo].[ApprovalRoutings]([SeverityId] ASC);

