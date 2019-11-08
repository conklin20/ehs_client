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
/****** Object:  Table [dbo].[HierarchyLevels]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[HierarchyLevels]') AND type in (N'U'))
DROP TABLE [dbo].[HierarchyLevels]
GO
/****** Object:  Table [dbo].[HierarchyLevels]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HierarchyLevels](
	[HierarchyLevelId] [int] IDENTITY(1,1) NOT NULL,
	[HierarchyLevelName] [nvarchar](50) NULL,
	[HierarchyLevel] [int] NULL,
	[HierarchyLevelAlias] [nvarchar](50) NULL,
 CONSTRAINT [PK_HierarchyLevels] PRIMARY KEY CLUSTERED 
(
	[HierarchyLevelId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
