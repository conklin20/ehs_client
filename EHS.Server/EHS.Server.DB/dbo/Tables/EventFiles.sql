CREATE TABLE [dbo].[EventFiles] (
    [EventFileId]    INT            IDENTITY (1, 1) NOT NULL,
    [EventId]        INT            NOT NULL,
    [UserId]         NVARCHAR (50)  NOT NULL,
    [ServerFileName] NVARCHAR (250) NOT NULL,
    [UserFileName]   NVARCHAR (250) NOT NULL,
    [CreatedOn]      DATETIME       CONSTRAINT [DF_EventFiles_CreatedOn] DEFAULT (getutcdate()) NOT NULL,
    CONSTRAINT [PK_EventFiles] PRIMARY KEY CLUSTERED ([EventFileId] ASC)
);


GO

-- =============================================
-- Author:		CC
-- Create date: 10/19/2019
-- Description:	Inserts record into app.AuditLog
-- =============================================
CREATE TRIGGER [dbo].[EventFilesAudit]
   ON  [dbo].[EventFiles]
   AFTER DELETE , INSERT--, UPDATE
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--UPDATE
	--if exists(select * from inserted) and exists(select * from deleted) 
	--begin
	--	insert into app.AuditLog
	--	--( TimestampUtc, EventType, TableRef, RecordId, Record, UserId ) 	 
	--	select GETUTCDATE()
	--			, 'UPDATE'
	--			, 'dbo.PeopleInvolved'
	--			, i.PeopleInvolvedId
	--			, concat('peopleInvolvedId: ',cast(i.PeopleInvolvedId as nvarchar),'|',
	--					'eventId: ',cast(i.EventId as nvarchar),'|',
	--					'employeeId: ', i.EmployeeId,'|',
	--					'comments: ', i.Comments)
	--			, dbo.fnGetUserContext()
	--	from inserted i
	--end

	--INSERT
	if exists(select * from inserted) and not exists(select * from deleted) 
	begin
		insert into app.AuditLog
		--( TimestampUtc, EventType, TableRef, RecordId, Record, UserId ) 	 
		select GETUTCDATE()
				, 'INSERT'
				, 'dbo.EventFiles'
				, i.EventFileId
				, concat('eventFileId: ',cast(i.EventFileId as nvarchar),'|',
						'eventId: ',cast(i.EventId as nvarchar),'|',
						'userId: ', i.UserId,'|',
						'serverFileName: ', i.ServerFileName,'|',
						'userFileName: ', i.UserFileName)
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
				, 'dbo.EventFiles'
				, d.EventFileId
				, concat('eventFileId: ',cast(d.EventFileId as nvarchar),'|',
						'eventId: ',cast(d.EventId as nvarchar),'|',
						'userId: ', d.UserId,'|',
						'serverFileName: ', d.ServerFileName,'|',
						'userFileName: ', d.UserFileName)
				, dbo.fnGetUserContext()
		from deleted d
	end
	
END