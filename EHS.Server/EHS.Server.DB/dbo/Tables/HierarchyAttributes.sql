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


GO


-- =============================================
-- Author:		CC
-- Create date: 11/23/2019
-- Description:	Inserts record into app.AuditLog
-- =============================================
CREATE TRIGGER [dbo].[HierarchyAttributesAudit]
   ON  [dbo].[HierarchyAttributes]
   AFTER  INSERT, UPDATE
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--UPDATE
	if exists(select * from inserted) and exists(select * from deleted) 
	begin
		insert into app.AuditLog
		--( TimestampUtc, EventType, TableRef, RecordId, Record, UserId ) 	 
		select GETUTCDATE()
				, 'UPDATE'
				, 'dbo.HierarchyAttributes'
				, i.HierarchyAttributeId
				, concat('HierarchyAttributeId: ',cast(i.HierarchyAttributeId as nvarchar),'|',
						'HierarchyId: ',cast(i.HierarchyId as nvarchar),'|',
						'AttributeId: ',cast(i.AttributeId as nvarchar),'|',
						'Key: ', i.[Key],'|',
						'Value: ',cast(i.[Value] as nvarchar),'|',
						'Enabled: ',cast(i.Enabled as nvarchar))
				, dbo.fnGetUserContext()
		from inserted i
	end

	--INSERT
	if exists(select * from inserted) and not exists(select * from deleted) 
	begin
		insert into app.AuditLog
		--( TimestampUtc, EventType, TableRef, RecordId, Record, UserId ) 	 
		select GETUTCDATE()
				, 'INSERT'
				, 'dbo.HierarchyAttributes'
				, i.HierarchyAttributeId
				, concat('HierarchyAttributeId: ',cast(i.HierarchyAttributeId as nvarchar),'|',
						'HierarchyId: ',cast(i.HierarchyId as nvarchar),'|',
						'AttributeId: ',cast(i.AttributeId as nvarchar),'|',
						'Key: ', i.[Key],'|',
						'Value: ',cast(i.[Value] as nvarchar),'|',
						'Enabled: ',cast(i.Enabled as nvarchar))
				, dbo.fnGetUserContext()
		from inserted i
	end
	
END