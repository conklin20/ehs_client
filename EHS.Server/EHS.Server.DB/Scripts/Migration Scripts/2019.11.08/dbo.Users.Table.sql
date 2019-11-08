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
/****** Object:  Trigger [UsersAudit]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[dbo].[UsersAudit]'))
DROP TRIGGER [dbo].[UsersAudit]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_Users_Enabled]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Users] DROP CONSTRAINT [DF_Users_Enabled]
END
GO
/****** Object:  Table [dbo].[Users]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
DROP TABLE [dbo].[Users]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserId] [nvarchar](50) NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
	[FirstName] [nvarchar](100) NOT NULL,
	[LastName] [nvarchar](100) NOT NULL,
	[LogicalHierarchyId] [int] NOT NULL,
	[PhysicalHierarchyId] [int] NOT NULL,
	[Phone] [nvarchar](20) NULL,
	[RoleId] [int] NULL,
	[TimeZone] [nvarchar](50) NULL,
	[DateFormat] [nvarchar](50) NULL,
	[CreatedOn] [datetime2](7) NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[ModifiedOn] [datetime2](7) NULL,
	[ModifiedBy] [nvarchar](50) NULL,
	[Enabled] [bit] NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_Enabled]  DEFAULT ((1)) FOR [Enabled]
GO
/****** Object:  Trigger [dbo].[UsersAudit]    Script Date: 11/8/2019 10:32:40 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
GO
ALTER TABLE [dbo].[Users] ENABLE TRIGGER [UsersAudit]
GO
