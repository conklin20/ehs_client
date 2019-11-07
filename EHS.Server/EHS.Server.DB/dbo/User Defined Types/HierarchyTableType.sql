CREATE TYPE [dbo].[HierarchyTableType] AS TABLE (
    [HierarchyId]      INT            NULL,
    [HierarchyName]    NVARCHAR (100) NOT NULL,
    [Lft]              INT            NOT NULL,
    [Rgt]              INT            NOT NULL,
    [HierarchyLevelId] INT            NOT NULL);

