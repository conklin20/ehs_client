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
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ApprovalRoutings_UserRoles_UserRoleId]') AND parent_object_id = OBJECT_ID(N'[dbo].[ApprovalRoutings]'))
ALTER TABLE [dbo].[ApprovalRoutings] DROP CONSTRAINT [FK_ApprovalRoutings_UserRoles_UserRoleId]
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ApprovalRoutings_Severities_SeverityId]') AND parent_object_id = OBJECT_ID(N'[dbo].[ApprovalRoutings]'))
ALTER TABLE [dbo].[ApprovalRoutings] DROP CONSTRAINT [FK_ApprovalRoutings_Severities_SeverityId]
GO
/****** Object:  Index [IX_ApprovalRoutings_UserRoleId]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[ApprovalRoutings]') AND name = N'IX_ApprovalRoutings_UserRoleId')
DROP INDEX [IX_ApprovalRoutings_UserRoleId] ON [dbo].[ApprovalRoutings]
GO
/****** Object:  Index [IX_ApprovalRoutings_SeverityId]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[ApprovalRoutings]') AND name = N'IX_ApprovalRoutings_SeverityId')
DROP INDEX [IX_ApprovalRoutings_SeverityId] ON [dbo].[ApprovalRoutings]
GO
/****** Object:  Table [dbo].[ApprovalRoutings]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ApprovalRoutings]') AND type in (N'U'))
DROP TABLE [dbo].[ApprovalRoutings]
GO
/****** Object:  Table [dbo].[ApprovalRoutings]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ApprovalRoutings](
	[ApprovalRoutingId] [int] IDENTITY(1,1) NOT NULL,
	[SeverityId] [int] NOT NULL,
	[UserRoleId] [int] NOT NULL,
	[ApprovalLevelName] [nvarchar](50) NOT NULL,
	[ApprovalLevel] [int] NOT NULL,
	[Enabled] [bit] NOT NULL,
 CONSTRAINT [PK_ApprovalRoutings] PRIMARY KEY CLUSTERED 
(
	[ApprovalRoutingId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Index [IX_ApprovalRoutings_SeverityId]    Script Date: 11/8/2019 10:32:39 AM ******/
CREATE NONCLUSTERED INDEX [IX_ApprovalRoutings_SeverityId] ON [dbo].[ApprovalRoutings]
(
	[SeverityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_ApprovalRoutings_UserRoleId]    Script Date: 11/8/2019 10:32:39 AM ******/
CREATE NONCLUSTERED INDEX [IX_ApprovalRoutings_UserRoleId] ON [dbo].[ApprovalRoutings]
(
	[UserRoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ApprovalRoutings]  WITH CHECK ADD  CONSTRAINT [FK_ApprovalRoutings_Severities_SeverityId] FOREIGN KEY([SeverityId])
REFERENCES [dbo].[Severities] ([SeverityId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ApprovalRoutings] CHECK CONSTRAINT [FK_ApprovalRoutings_Severities_SeverityId]
GO
ALTER TABLE [dbo].[ApprovalRoutings]  WITH CHECK ADD  CONSTRAINT [FK_ApprovalRoutings_UserRoles_UserRoleId] FOREIGN KEY([UserRoleId])
REFERENCES [dbo].[UserRoles] ([UserRoleId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ApprovalRoutings] CHECK CONSTRAINT [FK_ApprovalRoutings_UserRoles_UserRoleId]
GO
