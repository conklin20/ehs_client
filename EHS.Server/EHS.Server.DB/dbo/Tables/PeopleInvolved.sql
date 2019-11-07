CREATE TABLE [dbo].[PeopleInvolved] (
    [PeopleInvolvedId] INT             IDENTITY (1, 1) NOT NULL,
    [RoleId]           INT             NOT NULL,
    [EventId]          INT             NOT NULL,
    [EmployeeId]       NVARCHAR (50)   NULL,
    [Comments]         NVARCHAR (2000) NULL,
    CONSTRAINT [PK_PeopleInvolved] PRIMARY KEY CLUSTERED ([PeopleInvolvedId] ASC)
);




GO
-- =============================================
-- Author:		CC
-- Create date: 10/19/2019
-- Description:	Inserts record into app.AuditLog
-- =============================================
CREATE TRIGGER [dbo].[PeopleInvolvedAudit]
   ON  dbo.PeopleInvolved
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
				, 'dbo.PeopleInvolved'
				, i.PeopleInvolvedId
				, concat('peopleInvolvedId: ',cast(i.PeopleInvolvedId as nvarchar),'|',
						'eventId: ',cast(i.EventId as nvarchar),'|',
						'employeeId: ', i.EmployeeId,'|',
						'comments: ', i.Comments)
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
				, 'dbo.PeopleInvolved'
				, d.PeopleInvolvedId
				, concat('peopleInvolvedId: ',cast(d.PeopleInvolvedId as nvarchar),'|',
						'eventId: ',cast(d.EventId as nvarchar),'|',
						'employeeId: ', d.EmployeeId,'|',
						'comments: ', d.Comments)
				, dbo.fnGetUserContext()
		from deleted d
	end
	
END