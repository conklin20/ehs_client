CREATE TABLE [dbo].[Actions] (
    [ActionId]       INT            IDENTITY (1, 1) NOT NULL,
    [EventId]        INT            NOT NULL,
    [EventType]      NVARCHAR (50)  NOT NULL,
    [AssignedTo]     NVARCHAR (50)  NULL,
    [ActionToTake]   NVARCHAR (MAX) NOT NULL,
    [ActionType]     NVARCHAR (50)  NOT NULL,
    [DueDate]        DATETIME2 (7)  NOT NULL,
    [CompletionDate] DATETIME2 (7)  NULL,
    [ApprovalDate]   DATETIME2 (7)  NULL,
    [CreatedOn]      DATETIME2 (7)  NOT NULL,
    [CreatedBy]      NVARCHAR (50)  NOT NULL,
    [ModifiedOn]     DATETIME2 (7)  NOT NULL,
    [ModifiedBy]     NVARCHAR (50)  NOT NULL,
    CONSTRAINT [PK_Actions] PRIMARY KEY CLUSTERED ([ActionId] ASC)
);






GO
-- =============================================
-- Author:		CC
-- Create date: 10/9/2019
-- Description:	Inserts record into app.AuditLog
-- =============================================
CREATE TRIGGER [dbo].[ActionAudit]
   ON  [dbo].[Actions]
   AFTER DELETE , INSERT --, UPDATE
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	----UPDATE
	--if exists(select * from inserted) and exists(select * from deleted) 
	--begin
	--	insert into app.AuditLog
	--	--( TimestampUtc, EventType, TableRef, RecordId, Record, UserId ) 	 
	--	select GETUTCDATE()
	--			, 'UPDATE'
	--			, 'dbo.Actions'
	--			, i.ActionId
	--			, concat('eventId: ',cast(i.EventId as nvarchar),',',
	--					'eventType: ', i.EventType,',',
	--					'assignedTo: ', i.AssignedTo,',',
	--					'actionToTake: ', i.ActionToTake,',', 
	--					'actionType: ', i.ActionType,',', 
	--					'dueDate: ', i.DueDate,',', 
	--					'completionDate: ', i.CompletionDate,',', 
	--					'approvalDate: ', i.ApprovalDate)
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
				, 'dbo.Actions'
				, i.ActionId
				, concat('eventId: ',cast(i.EventId as nvarchar),',',
						'eventType: ', i.EventType,',',
						'assignedTo: ', i.AssignedTo,',',
						'actionToTake: ', i.ActionToTake,',', 
						'actionType: ', i.ActionType,',', 
						'dueDate: ', i.DueDate,',', 
						'completionDate: ', i.CompletionDate,',', 
						'approvalDate: ', i.ApprovalDate)
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
				, 'dbo.Actions'
				, d.ActionId
				, concat('eventId: ',cast(d.EventId as nvarchar),' | ',
						'eventType: ', d.EventType,' | ',
						'assignedTo: ', d.AssignedTo,' | ',
						'actionToTake: ', d.ActionToTake,' | ', 
						'actionType: ', d.ActionType,' | ', 
						'dueDate: ', d.DueDate,' | ', 
						'completionDate: ', d.CompletionDate,' | ', 
						'approvalDate: ', d.ApprovalDate)
				, dbo.fnGetUserContext()
		from deleted d
	end
	
END