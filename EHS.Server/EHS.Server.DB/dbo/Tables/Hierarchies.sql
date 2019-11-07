CREATE TABLE [dbo].[Hierarchies] (
    [HierarchyId]      INT           IDENTITY (1, 1) NOT NULL,
    [HierarchyName]    NVARCHAR (50) NOT NULL,
    [Lft]              INT           NOT NULL,
    [Rgt]              INT           NOT NULL,
    [HierarchyLevelId] INT           NOT NULL,
    [CreatedOn]        DATETIME2 (7) NOT NULL,
    [CreatedBy]        NVARCHAR (50) NOT NULL,
    [ModifiedOn]       DATETIME2 (7) NOT NULL,
    [ModifiedBy]       NVARCHAR (50) NOT NULL,
    CONSTRAINT [PK_Hierarchies] PRIMARY KEY CLUSTERED ([HierarchyId] ASC),
    CONSTRAINT [FK_Hierarchies_HierarchyLevels_HierarchyLevelId] FOREIGN KEY ([HierarchyLevelId]) REFERENCES [dbo].[HierarchyLevels] ([HierarchyLevelId]) ON DELETE CASCADE
);






GO
CREATE NONCLUSTERED INDEX [IX_Hierarchies_HierarchyLevelId]
    ON [dbo].[Hierarchies]([HierarchyLevelId] ASC);


GO

-- =============================================
-- Author:		CC
-- Create date: 11/04/2019
-- Description:	Inserts record into app.AuditLog
-- =============================================
CREATE TRIGGER [dbo].[HierarchiesAudit]
   ON  [dbo].[Hierarchies]
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
				, 'dbo.Hierarchies'
				, i.HierarchyId
				, concat('HierarchyId: ',cast(i.HierarchyId as nvarchar),'|',
						'HierarchyName: ', i.HierarchyName,'|',
						'Lft: ',cast(i.Lft as nvarchar),'|',
						'Rgt: ',cast(i.Rgt as nvarchar),'|',
						'HierarchyLevelId: ',cast(i.HierarchyLevelId as nvarchar))
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
				, 'dbo.Hierarchies'
				, i.HierarchyId
				, concat('HierarchyId: ',cast(i.HierarchyId as nvarchar),'|',
						'HierarchyName: ', i.HierarchyName,'|',
						'Lft: ',cast(i.Lft as nvarchar),'|',
						'Rgt: ',cast(i.Rgt as nvarchar),'|',
						'HierarchyLevelId: ',cast(i.HierarchyLevelId as nvarchar))
				, dbo.fnGetUserContext()
		from inserted i
	end
	--DELETE
	--if exists(select * from deleted) and not exists(select * from inserted) 
	--begin
	--	insert into app.AuditLog
	--	--( TimestampUtc, EventType, TableRef, RecordId, Record, UserId ) 	 
	--	select GETUTCDATE()
	--			, 'DELETE'
	--			, 'dbo.PeopleInvolved'
	--			, d.PeopleInvolvedId
	--			, concat('peopleInvolvedId: ',cast(d.PeopleInvolvedId as nvarchar),'|',
	--					'eventId: ',cast(d.EventId as nvarchar),'|',
	--					'employeeId: ', d.EmployeeId,'|',
	--					'comments: ', d.Comments)
	--			, dbo.fnGetUserContext()
	--	from deleted d
	--end
	
END