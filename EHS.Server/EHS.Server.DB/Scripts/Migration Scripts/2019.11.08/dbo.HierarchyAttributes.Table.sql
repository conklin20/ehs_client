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
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_HierarchyAttributes_Hierarchies_HierarchyId]') AND parent_object_id = OBJECT_ID(N'[dbo].[HierarchyAttributes]'))
ALTER TABLE [dbo].[HierarchyAttributes] DROP CONSTRAINT [FK_HierarchyAttributes_Hierarchies_HierarchyId]
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_HierarchyAttributes_Attributes_AttributeId]') AND parent_object_id = OBJECT_ID(N'[dbo].[HierarchyAttributes]'))
ALTER TABLE [dbo].[HierarchyAttributes] DROP CONSTRAINT [FK_HierarchyAttributes_Attributes_AttributeId]
GO
/****** Object:  Index [IX_HierarchyAttributes_HierarchyId]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[HierarchyAttributes]') AND name = N'IX_HierarchyAttributes_HierarchyId')
DROP INDEX [IX_HierarchyAttributes_HierarchyId] ON [dbo].[HierarchyAttributes]
GO
/****** Object:  Index [IX_HierarchyAttributes_AttributeId]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[HierarchyAttributes]') AND name = N'IX_HierarchyAttributes_AttributeId')
DROP INDEX [IX_HierarchyAttributes_AttributeId] ON [dbo].[HierarchyAttributes]
GO
/****** Object:  Table [dbo].[HierarchyAttributes]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[HierarchyAttributes]') AND type in (N'U'))
DROP TABLE [dbo].[HierarchyAttributes]
GO
/****** Object:  Table [dbo].[HierarchyAttributes]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HierarchyAttributes](
	[HierarchyAttributeId] [int] IDENTITY(1,1) NOT NULL,
	[HierarchyId] [int] NOT NULL,
	[AttributeId] [int] NOT NULL,
	[Key] [nvarchar](50) NOT NULL,
	[Value] [nvarchar](max) NOT NULL,
	[Enabled] [bit] NOT NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[CreatedBy] [nvarchar](50) NOT NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_HierarchyAttributes] PRIMARY KEY CLUSTERED 
(
	[HierarchyAttributeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Index [IX_HierarchyAttributes_AttributeId]    Script Date: 11/8/2019 10:32:39 AM ******/
CREATE NONCLUSTERED INDEX [IX_HierarchyAttributes_AttributeId] ON [dbo].[HierarchyAttributes]
(
	[AttributeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_HierarchyAttributes_HierarchyId]    Script Date: 11/8/2019 10:32:39 AM ******/
CREATE NONCLUSTERED INDEX [IX_HierarchyAttributes_HierarchyId] ON [dbo].[HierarchyAttributes]
(
	[HierarchyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[HierarchyAttributes]  WITH CHECK ADD  CONSTRAINT [FK_HierarchyAttributes_Attributes_AttributeId] FOREIGN KEY([AttributeId])
REFERENCES [dbo].[Attributes] ([AttributeId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[HierarchyAttributes] CHECK CONSTRAINT [FK_HierarchyAttributes_Attributes_AttributeId]
GO
ALTER TABLE [dbo].[HierarchyAttributes]  WITH CHECK ADD  CONSTRAINT [FK_HierarchyAttributes_Hierarchies_HierarchyId] FOREIGN KEY([HierarchyId])
REFERENCES [dbo].[Hierarchies] ([HierarchyId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[HierarchyAttributes] CHECK CONSTRAINT [FK_HierarchyAttributes_Hierarchies_HierarchyId]
GO
