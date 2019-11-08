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
/****** Object:  Trigger [PeopleInvolvedAudit]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[dbo].[PeopleInvolvedAudit]'))
DROP TRIGGER [dbo].[PeopleInvolvedAudit]
GO
/****** Object:  Table [dbo].[PeopleInvolved]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PeopleInvolved]') AND type in (N'U'))
DROP TABLE [dbo].[PeopleInvolved]
GO
/****** Object:  Table [dbo].[PeopleInvolved]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PeopleInvolved](
	[PeopleInvolvedId] [int] IDENTITY(1,1) NOT NULL,
	[RoleId] [int] NOT NULL,
	[EventId] [int] NOT NULL,
	[EmployeeId] [nvarchar](50) NULL,
	[Comments] [nvarchar](2000) NULL,
 CONSTRAINT [PK_PeopleInvolved] PRIMARY KEY CLUSTERED 
(
	[PeopleInvolvedId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Trigger [dbo].[PeopleInvolvedAudit]    Script Date: 11/8/2019 10:32:40 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CC
-- Create date: 10/19/2019
-- Description:	Inserts record into app.AuditLog
-- =============================================
CREATE TRIGGER [dbo].[PeopleInvolvedAudit]
   ON  [dbo].[PeopleInvolved]
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
GO
ALTER TABLE [dbo].[PeopleInvolved] ENABLE TRIGGER [PeopleInvolvedAudit]
GO
