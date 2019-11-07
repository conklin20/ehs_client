CREATE TABLE [dbo].[EventCauses] (
    [EventCauseId] INT             IDENTITY (1, 1) NOT NULL,
    [EventId]      INT             NOT NULL,
    [CauseId]      INT             NOT NULL,
    [Comments]     NVARCHAR (2000) NULL,
    CONSTRAINT [PK_EventCauses] PRIMARY KEY CLUSTERED ([EventCauseId] ASC)
);




GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'will be the HierarchyAttributeId from the Root Cause, Immediate Cause or Contributing Factor keys ', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'EventCauses', @level2type = N'COLUMN', @level2name = N'CauseId';


GO


-- =============================================
-- Author:		CC
-- Create date: 10/19/2019
-- Description:	Inserts record into app.AuditLog
-- =============================================
CREATE TRIGGER [dbo].[EventCausesAudit]
   ON  [dbo].[EventCauses]
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
				, 'dbo.EventCauses'
				, i.EventCauseId
				, concat('eventCauseId: ',cast(i.EventCauseId as nvarchar),'|',
						'eventId: ',cast(i.EventId as nvarchar),'|',
						'causeId: ', i.CauseId,'|',
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
				, 'dbo.EventCauses'
				, d.EventCauseId
				, concat('eventCauseId: ',cast(d.EventCauseId as nvarchar),'|',
						'eventId: ',cast(d.EventId as nvarchar),'|',
						'causeId: ', d.CauseId,'|',
						'comments: ', d.Comments)
				, dbo.fnGetUserContext()
		from deleted d
	end
	
END