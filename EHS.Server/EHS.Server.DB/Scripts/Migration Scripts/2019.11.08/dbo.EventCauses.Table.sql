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
IF  EXISTS (SELECT * FROM sys.fn_listextendedproperty(N'MS_Description' , N'SCHEMA',N'dbo', N'TABLE',N'EventCauses', N'COLUMN',N'CauseId'))
EXEC sys.sp_dropextendedproperty @name=N'MS_Description' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'EventCauses', @level2type=N'COLUMN',@level2name=N'CauseId'
GO
/****** Object:  Trigger [EventCausesAudit]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[dbo].[EventCausesAudit]'))
DROP TRIGGER [dbo].[EventCausesAudit]
GO
/****** Object:  Table [dbo].[EventCauses]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[EventCauses]') AND type in (N'U'))
DROP TABLE [dbo].[EventCauses]
GO
/****** Object:  Table [dbo].[EventCauses]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EventCauses](
	[EventCauseId] [int] IDENTITY(1,1) NOT NULL,
	[EventId] [int] NOT NULL,
	[CauseId] [int] NOT NULL,
	[Comments] [nvarchar](2000) NULL,
 CONSTRAINT [PK_EventCauses] PRIMARY KEY CLUSTERED 
(
	[EventCauseId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Trigger [dbo].[EventCausesAudit]    Script Date: 11/8/2019 10:32:40 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
GO
ALTER TABLE [dbo].[EventCauses] ENABLE TRIGGER [EventCausesAudit]
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'will be the HierarchyAttributeId from the Root Cause, Immediate Cause or Contributing Factor keys ' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'EventCauses', @level2type=N'COLUMN',@level2name=N'CauseId'
GO
