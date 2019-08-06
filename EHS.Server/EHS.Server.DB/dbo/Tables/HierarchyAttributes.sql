CREATE TABLE [dbo].[HierarchyAttributes] (
    [HierarchyAttributeId] INT            IDENTITY (1, 1) NOT NULL,
    [HierarchyId]          INT            NOT NULL,
    [AttributeId]          INT            NOT NULL,
    [Key]                  NVARCHAR (50)  NOT NULL,
    [Value]                NVARCHAR (MAX) NOT NULL,
    [Enabled]              BIT            NOT NULL,
    [CreatedOn]            DATETIME2 (7)  NOT NULL,
    [CreatedBy]            NVARCHAR (50)  NOT NULL,
    [ModifiedOn]           DATETIME2 (7)  NOT NULL,
    [ModifiedBy]           NVARCHAR (50)  NOT NULL,
    CONSTRAINT [PK_HierarchyAttributes] PRIMARY KEY CLUSTERED ([HierarchyAttributeId] ASC),
    CONSTRAINT [FK_HierarchyAttributes_Attributes_AttributeId] FOREIGN KEY ([AttributeId]) REFERENCES [dbo].[Attributes] ([AttributeId]) ON DELETE CASCADE,
    CONSTRAINT [FK_HierarchyAttributes_Hierarchies_HierarchyId] FOREIGN KEY ([HierarchyId]) REFERENCES [dbo].[Hierarchies] ([HierarchyId]) ON DELETE CASCADE
);




GO
CREATE NONCLUSTERED INDEX [IX_HierarchyAttributes_AttributeId]
    ON [dbo].[HierarchyAttributes]([AttributeId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_HierarchyAttributes_HierarchyId]
    ON [dbo].[HierarchyAttributes]([HierarchyId] ASC);

