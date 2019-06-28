CREATE TABLE [dbo].[ResultSeverities] (
    [ResultSeverityId]     INT IDENTITY (1, 1) NOT NULL,
    [HierarchyAttributeId] INT NOT NULL,
    [SeverityId]           INT NOT NULL,
    [Enabled]              BIT NOT NULL,
    CONSTRAINT [PK_ResultSeverities] PRIMARY KEY CLUSTERED ([ResultSeverityId] ASC),
    CONSTRAINT [FK_ResultSeverities_HierarchyAttributes_HierarchyAttributeId] FOREIGN KEY ([HierarchyAttributeId]) REFERENCES [dbo].[HierarchyAttributes] ([HierarchyAttributeId]) ON DELETE CASCADE,
    CONSTRAINT [FK_ResultSeverities_Severities_SeverityId] FOREIGN KEY ([SeverityId]) REFERENCES [dbo].[Severities] ([SeverityId]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_ResultSeverities_HierarchyAttributeId]
    ON [dbo].[ResultSeverities]([HierarchyAttributeId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_ResultSeverities_SeverityId]
    ON [dbo].[ResultSeverities]([SeverityId] ASC);

