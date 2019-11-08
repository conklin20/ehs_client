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
/****** Object:  UserDefinedTableType [dbo].[CausesTableType]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'CausesTableType' AND ss.name = N'dbo')
DROP TYPE [dbo].[CausesTableType]
GO
/****** Object:  UserDefinedTableType [dbo].[CausesTableType]    Script Date: 11/8/2019 10:32:39 AM ******/
CREATE TYPE [dbo].[CausesTableType] AS TABLE(
	[EventId] [int] NOT NULL,
	[CauseId] [int] NOT NULL,
	[Comments] [nvarchar](max) NULL
)
GO
