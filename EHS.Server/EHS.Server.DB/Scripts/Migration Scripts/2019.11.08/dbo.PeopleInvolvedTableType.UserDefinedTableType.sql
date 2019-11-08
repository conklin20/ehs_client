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
/****** Object:  UserDefinedTableType [dbo].[PeopleInvolvedTableType]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE st.name = N'PeopleInvolvedTableType' AND ss.name = N'dbo')
DROP TYPE [dbo].[PeopleInvolvedTableType]
GO
/****** Object:  UserDefinedTableType [dbo].[PeopleInvolvedTableType]    Script Date: 11/8/2019 10:32:39 AM ******/
CREATE TYPE [dbo].[PeopleInvolvedTableType] AS TABLE(
	[RoleId] [int] NOT NULL,
	[EventId] [int] NOT NULL,
	[EmployeeId] [nvarchar](50) NOT NULL,
	[Comments] [nvarchar](max) NULL
)
GO
