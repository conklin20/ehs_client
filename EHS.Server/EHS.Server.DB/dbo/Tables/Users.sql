CREATE TABLE [dbo].[Users] (
    [UserId]              NVARCHAR (50)  NOT NULL,
    [Email]               NVARCHAR (255) NOT NULL,
    [FirstName]           NVARCHAR (100) NOT NULL,
    [LastName]            NVARCHAR (100) NOT NULL,
    [LogicalHierarchyId]  INT            NOT NULL,
    [PhysicalHierarchyId] INT            NOT NULL,
    [Phone]               NVARCHAR (20)  NULL,
    [RoleId]              INT            NULL,
    [TimeZone]            NVARCHAR (50)  NULL,
    [DateFormat]          NVARCHAR (50)  NULL,
    [CreatedOn]           DATETIME2 (7)  NULL,
    [CreatedBy]           NVARCHAR (50)  NULL,
    [ModifiedOn]          DATETIME2 (7)  NULL,
    [ModifiedBy]          NVARCHAR (50)  NULL,
    [Enabled]             BIT            CONSTRAINT [DF_Users_Enabled] DEFAULT ((1)) NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([UserId] ASC)
);








GO


-- =============================================
-- Author:		CC
-- Create date: 10/19/2019
-- Description:	Inserts record into app.AuditLog
-- =============================================
CREATE TRIGGER [dbo].[UsersAudit]
   ON  [dbo].[Users]
   AFTER DELETE , INSERT, UPDATE
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
				, 'dbo.Users'
				, -1 --UserId is an nvarchar, cant insert it here
				, concat('UserId: ',cast(i.UserId as nvarchar),'|',
						'Email: ',cast(i.Email as nvarchar),'|',
						'FirstName: ',cast(i.FirstName as nvarchar),'|',
						'LastName: ', i.LastName,'|',
						'LogicalHierarchyId: ', i.LogicalHierarchyId,'|',
						'PhysicalHierarchyId: ', i.PhysicalHierarchyId,'|',
						'Phone: ', i.Phone,'|',
						'RoleId: ', i.RoleId,'|',
						'TimeZone: ', i.TimeZone,'|',
						'DateFormat: ', i.DateFormat,'|',
						'Enabled: ', i.Enabled)
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
				, 'dbo.Users'
				, -1
				, concat('UserId: ',cast(i.UserId as nvarchar),'|',
						'Email: ',cast(i.Email as nvarchar),'|',
						'FirstName: ',cast(i.FirstName as nvarchar),'|',
						'LastName: ', i.LastName,'|',
						'LogicalHierarchyId: ', i.LogicalHierarchyId,'|',
						'PhysicalHierarchyId: ', i.PhysicalHierarchyId,'|',
						'Phone: ', i.Phone,'|',
						'RoleId: ', i.RoleId,'|',
						'TimeZone: ', i.TimeZone,'|',
						'DateFormat: ', i.DateFormat,'|',
						'Enabled: ', i.Enabled)
				, dbo.fnGetUserContext()
		from inserted i
	end
	--DELETE
	if exists(select * from deleted) and not exists(select * from inserted) 
	begin
		insert into app.AuditLog
		--( TimestampUtc, EventType, TableRef, RecordId, Record, UserId ) 	 
		select GETUTCDATE()
				, 'DELETE'
				, 'dbo.Users'
				, -1
				, concat('UserId: ',cast(d.UserId as nvarchar),'|',
						'Email: ',cast(d.Email as nvarchar),'|',
						'FirstName: ',cast(d.FirstName as nvarchar),'|',
						'LastName: ', d.LastName,'|',
						'LogicalHierarchyId: ', d.LogicalHierarchyId,'|',
						'PhysicalHierarchyId: ', d.PhysicalHierarchyId,'|',
						'Phone: ', d.Phone,'|',
						'RoleId: ', d.RoleId,'|',
						'TimeZone: ', d.TimeZone,'|',
						'DateFormat: ', d.DateFormat,'|',
						'Enabled: ', d.Enabled)
				, dbo.fnGetUserContext()
		from deleted d
	end
	
END