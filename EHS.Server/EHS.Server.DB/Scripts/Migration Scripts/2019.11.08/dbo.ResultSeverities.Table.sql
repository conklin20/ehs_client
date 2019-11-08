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
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ResultSeverities_Severities_SeverityId]') AND parent_object_id = OBJECT_ID(N'[dbo].[ResultSeverities]'))
ALTER TABLE [dbo].[ResultSeverities] DROP CONSTRAINT [FK_ResultSeverities_Severities_SeverityId]
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ResultSeverities_HierarchyAttributes_HierarchyAttributeId]') AND parent_object_id = OBJECT_ID(N'[dbo].[ResultSeverities]'))
ALTER TABLE [dbo].[ResultSeverities] DROP CONSTRAINT [FK_ResultSeverities_HierarchyAttributes_HierarchyAttributeId]
GO
/****** Object:  Index [IX_ResultSeverities_SeverityId]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[ResultSeverities]') AND name = N'IX_ResultSeverities_SeverityId')
DROP INDEX [IX_ResultSeverities_SeverityId] ON [dbo].[ResultSeverities]
GO
/****** Object:  Index [IX_ResultSeverities_HierarchyAttributeId]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[ResultSeverities]') AND name = N'IX_ResultSeverities_HierarchyAttributeId')
DROP INDEX [IX_ResultSeverities_HierarchyAttributeId] ON [dbo].[ResultSeverities]
GO
/****** Object:  Table [dbo].[ResultSeverities]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ResultSeverities]') AND type in (N'U'))
DROP TABLE [dbo].[ResultSeverities]
GO
/****** Object:  Table [dbo].[ResultSeverities]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ResultSeverities](
	[ResultSeverityId] [int] IDENTITY(1,1) NOT NULL,
	[HierarchyAttributeId] [int] NOT NULL,
	[SeverityId] [int] NOT NULL,
	[Enabled] [bit] NOT NULL,
 CONSTRAINT [PK_ResultSeverities] PRIMARY KEY CLUSTERED 
(
	[ResultSeverityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Index [IX_ResultSeverities_HierarchyAttributeId]    Script Date: 11/8/2019 10:32:39 AM ******/
CREATE NONCLUSTERED INDEX [IX_ResultSeverities_HierarchyAttributeId] ON [dbo].[ResultSeverities]
(
	[HierarchyAttributeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_ResultSeverities_SeverityId]    Script Date: 11/8/2019 10:32:39 AM ******/
CREATE NONCLUSTERED INDEX [IX_ResultSeverities_SeverityId] ON [dbo].[ResultSeverities]
(
	[SeverityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ResultSeverities]  WITH CHECK ADD  CONSTRAINT [FK_ResultSeverities_HierarchyAttributes_HierarchyAttributeId] FOREIGN KEY([HierarchyAttributeId])
REFERENCES [dbo].[HierarchyAttributes] ([HierarchyAttributeId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ResultSeverities] CHECK CONSTRAINT [FK_ResultSeverities_HierarchyAttributes_HierarchyAttributeId]
GO
ALTER TABLE [dbo].[ResultSeverities]  WITH CHECK ADD  CONSTRAINT [FK_ResultSeverities_Severities_SeverityId] FOREIGN KEY([SeverityId])
REFERENCES [dbo].[Severities] ([SeverityId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ResultSeverities] CHECK CONSTRAINT [FK_ResultSeverities_Severities_SeverityId]
GO
