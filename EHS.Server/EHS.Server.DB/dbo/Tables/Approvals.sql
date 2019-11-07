CREATE TABLE [dbo].[Approvals] (
    [ApprovalId]      INT            IDENTITY (1, 1) NOT NULL,
    [ActionId]        INT            NOT NULL,
    [ApprovalLevelId] INT            NOT NULL,
    [ApprovedBy]      NVARCHAR (50)  NULL,
    [ApprovedOn]      DATETIME2 (7)  NOT NULL,
    [Notes]           NVARCHAR (255) NULL,
    CONSTRAINT [PK_Approvals] PRIMARY KEY CLUSTERED ([ApprovalId] ASC)
);






GO

-- =============================================
-- Author:		CC
-- Create date: 10/10/2019
-- Description:	Inserts record into app.AuditLog
-- =============================================
CREATE TRIGGER [dbo].[ApprovalAudit]
   ON  [dbo].[Approvals]
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
				, 'dbo.Approvals'
				, i.ApprovalId
				, 'COMPLETE LATER'
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
				, 'dbo.Approvals'
				, i.ApprovalId
				, 'COMPLETE LATER'
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
				, 'dbo.Approvals'
				, d.ApprovalId
				, 'COMPLETE LATER'
				, dbo.fnGetUserContext()
		from deleted d
	end
	
END