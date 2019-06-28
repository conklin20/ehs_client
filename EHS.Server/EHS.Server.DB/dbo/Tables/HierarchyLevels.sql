CREATE TABLE [dbo].[HierarchyLevels] (
    [HierarchyLevelId]   INT           IDENTITY (1, 1) NOT NULL,
    [HierarchyLevelName] NVARCHAR (50) NULL,
    CONSTRAINT [PK_HierarchyLevels] PRIMARY KEY CLUSTERED ([HierarchyLevelId] ASC)
);

