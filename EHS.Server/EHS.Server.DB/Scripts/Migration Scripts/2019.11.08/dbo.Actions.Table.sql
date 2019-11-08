/*    ==Scripting Parameters==

    Source Server Version : SQL Server 2017 (14.0.1000)
    Source Database Engine Edition : Microsoft SQL Server Enterprise Edition
    Source Database Engine Type : Standalone SQL Server

    Target Server Version : SQL Server 2014
    Target Database Engine Edition : Microsoft SQL Server Enterprise Edition
    Target Database Engine Type : Standalone SQL Server
*/
USE [EHS_Dev]
GO
/****** Object:  Trigger [ActionAudit]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[dbo].[ActionAudit]'))
DROP TRIGGER [dbo].[ActionAudit]
GO
/****** Object:  Table [dbo].[Actions]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Actions]') AND type in (N'U'))
DROP TABLE [dbo].[Actions]
GO
/****** Object:  Table [dbo].[Actions]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Actions](
	[ActionId] [int] IDENTITY(1,1) NOT NULL,
	[EventId] [int] NOT NULL,
	[EventType] [nvarchar](50) NOT NULL,
	[AssignedTo] [nvarchar](50) NULL,
	[ActionToTake] [nvarchar](max) NOT NULL,
	[ActionType] [nvarchar](50) NOT NULL,
	[DueDate] [datetime2](7) NOT NULL,
	[CompletionDate] [datetime2](7) NULL,
	[ApprovalDate] [datetime2](7) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[CreatedBy] [nvarchar](50) NOT NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Actions] PRIMARY KEY CLUSTERED 
(
	[ActionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Trigger [dbo].[ActionAudit]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
GO
ALTER TABLE [dbo].[Actions] ENABLE TRIGGER [ActionAudit]
GO
