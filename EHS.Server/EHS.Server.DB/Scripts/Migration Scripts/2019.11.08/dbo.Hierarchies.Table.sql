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
/****** Object:  Trigger [HierarchiesAudit]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[dbo].[HierarchiesAudit]'))
DROP TRIGGER [dbo].[HierarchiesAudit]
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Hierarchies_HierarchyLevels_HierarchyLevelId]') AND parent_object_id = OBJECT_ID(N'[dbo].[Hierarchies]'))
ALTER TABLE [dbo].[Hierarchies] DROP CONSTRAINT [FK_Hierarchies_HierarchyLevels_HierarchyLevelId]
GO
/****** Object:  Index [IX_Hierarchies_HierarchyLevelId]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[Hierarchies]') AND name = N'IX_Hierarchies_HierarchyLevelId')
DROP INDEX [IX_Hierarchies_HierarchyLevelId] ON [dbo].[Hierarchies]
GO
/****** Object:  Table [dbo].[Hierarchies]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Hierarchies]') AND type in (N'U'))
DROP TABLE [dbo].[Hierarchies]
GO
/****** Object:  Table [dbo].[Hierarchies]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Hierarchies](
	[HierarchyId] [int] IDENTITY(1,1) NOT NULL,
	[HierarchyName] [nvarchar](50) NOT NULL,
	[Lft] [int] NOT NULL,
	[Rgt] [int] NOT NULL,
	[HierarchyLevelId] [int] NOT NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[CreatedBy] [nvarchar](50) NOT NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Hierarchies] PRIMARY KEY CLUSTERED 
(
	[HierarchyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Index [IX_Hierarchies_HierarchyLevelId]    Script Date: 11/8/2019 10:32:39 AM ******/
CREATE NONCLUSTERED INDEX [IX_Hierarchies_HierarchyLevelId] ON [dbo].[Hierarchies]
(
	[HierarchyLevelId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Hierarchies]  WITH CHECK ADD  CONSTRAINT [FK_Hierarchies_HierarchyLevels_HierarchyLevelId] FOREIGN KEY([HierarchyLevelId])
REFERENCES [dbo].[HierarchyLevels] ([HierarchyLevelId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Hierarchies] CHECK CONSTRAINT [FK_Hierarchies_HierarchyLevels_HierarchyLevelId]
GO
/****** Object:  Trigger [dbo].[HierarchiesAudit]    Script Date: 11/8/2019 10:32:40 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 11/04/2019
-- Description:	Inserts record into app.AuditLog
-- =============================================
CREATE TRIGGER [dbo].[HierarchiesAudit]
   ON  [dbo].[Hierarchies]
   AFTER  INSERT, UPDATE
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
				, 'dbo.Hierarchies'
				, i.HierarchyId
				, concat('HierarchyId: ',cast(i.HierarchyId as nvarchar),'|',
						'HierarchyName: ', i.HierarchyName,'|',
						'Lft: ',cast(i.Lft as nvarchar),'|',
						'Rgt: ',cast(i.Rgt as nvarchar),'|',
						'HierarchyLevelId: ',cast(i.HierarchyLevelId as nvarchar))
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
				, 'dbo.Hierarchies'
				, i.HierarchyId
				, concat('HierarchyId: ',cast(i.HierarchyId as nvarchar),'|',
						'HierarchyName: ', i.HierarchyName,'|',
						'Lft: ',cast(i.Lft as nvarchar),'|',
						'Rgt: ',cast(i.Rgt as nvarchar),'|',
						'HierarchyLevelId: ',cast(i.HierarchyLevelId as nvarchar))
				, dbo.fnGetUserContext()
		from inserted i
	end
	--DELETE
	--if exists(select * from deleted) and not exists(select * from inserted) 
	--begin
	--	insert into app.AuditLog
	--	--( TimestampUtc, EventType, TableRef, RecordId, Record, UserId ) 	 
	--	select GETUTCDATE()
	--			, 'DELETE'
	--			, 'dbo.PeopleInvolved'
	--			, d.PeopleInvolvedId
	--			, concat('peopleInvolvedId: ',cast(d.PeopleInvolvedId as nvarchar),'|',
	--					'eventId: ',cast(d.EventId as nvarchar),'|',
	--					'employeeId: ', d.EmployeeId,'|',
	--					'comments: ', d.Comments)
	--			, dbo.fnGetUserContext()
	--	from deleted d
	--end
	
END
GO
ALTER TABLE [dbo].[Hierarchies] ENABLE TRIGGER [HierarchiesAudit]
GO
