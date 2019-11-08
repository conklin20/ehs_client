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
/****** Object:  Trigger [EventFilesAudit]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[dbo].[EventFilesAudit]'))
DROP TRIGGER [dbo].[EventFilesAudit]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_EventFiles_CreatedOn]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[EventFiles] DROP CONSTRAINT [DF_EventFiles_CreatedOn]
END
GO
/****** Object:  Table [dbo].[EventFiles]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[EventFiles]') AND type in (N'U'))
DROP TABLE [dbo].[EventFiles]
GO
/****** Object:  Table [dbo].[EventFiles]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EventFiles](
	[EventFileId] [int] IDENTITY(1,1) NOT NULL,
	[EventId] [int] NOT NULL,
	[UserId] [nvarchar](50) NOT NULL,
	[ServerFileName] [nvarchar](250) NOT NULL,
	[UserFileName] [nvarchar](250) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
 CONSTRAINT [PK_EventFiles] PRIMARY KEY CLUSTERED 
(
	[EventFileId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[EventFiles] ADD  CONSTRAINT [DF_EventFiles_CreatedOn]  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
/****** Object:  Trigger [dbo].[EventFilesAudit]    Script Date: 11/8/2019 10:32:40 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
GO
ALTER TABLE [dbo].[EventFiles] ENABLE TRIGGER [EventFilesAudit]
GO
