CREATE TABLE [dbo].[Hierarchies] (
    [CreatedOn]        DATETIME2 (7) NOT NULL,
    [CreatedBy]        NVARCHAR (50) NOT NULL,
    [ModifiedOn]       DATETIME2 (7) NOT NULL,
    [ModifiedBy]       NVARCHAR (50) NOT NULL,
    [HierarchyId]      INT           IDENTITY (1, 1) NOT NULL,
    [HierarchyName]    NVARCHAR (50) NOT NULL,
    [Lft]              INT           NOT NULL,
    [Rgt]              INT           NOT NULL,
    [HierarchyLevelId] INT           NOT NULL,
    CONSTRAINT [PK_Hierarchies] PRIMARY KEY CLUSTERED ([HierarchyId] ASC),
    CONSTRAINT [FK_Hierarchies_HierarchyLevels_HierarchyLevelId] FOREIGN KEY ([HierarchyLevelId]) REFERENCES [dbo].[HierarchyLevels] ([HierarchyLevelId]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_Hierarchies_HierarchyLevelId]
    ON [dbo].[Hierarchies]([HierarchyLevelId] ASC);

