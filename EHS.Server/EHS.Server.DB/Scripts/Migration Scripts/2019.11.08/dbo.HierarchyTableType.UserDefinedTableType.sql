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
/****** Object:  UserDefinedTableType [dbo].[HierarchyTableType]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'HierarchyTableType' AND ss.name = N'dbo')
DROP TYPE [dbo].[HierarchyTableType]
GO
/****** Object:  UserDefinedTableType [dbo].[HierarchyTableType]    Script Date: 11/8/2019 10:32:39 AM ******/
CREATE TYPE [dbo].[HierarchyTableType] AS TABLE(
	[HierarchyId] [int] NULL,
	[HierarchyName] [nvarchar](100) NOT NULL,
	[Lft] [int] NOT NULL,
	[Rgt] [int] NOT NULL,
	[HierarchyLevelId] [int] NOT NULL
)
GO
