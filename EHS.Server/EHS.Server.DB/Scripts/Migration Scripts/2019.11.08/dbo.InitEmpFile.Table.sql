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
/****** Object:  Table [dbo].[InitEmpFile]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[InitEmpFile]') AND type in (N'U'))
DROP TABLE [dbo].[InitEmpFile]
GO
/****** Object:  Table [dbo].[InitEmpFile]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InitEmpFile](
	[EmployeeId] [nvarchar](50) NULL,
	[FirstName] [nvarchar](100) NULL,
	[LastName] [nvarchar](100) NULL,
	[BirthDate] [date] NULL,
	[Sex] [nvarchar](15) NULL,
	[SupervisorId] [nvarchar](50) NULL,
	[LastUpdatedOn] [datetime2](7) NULL,
	[Active] [bit] NULL,
	[Email] [nvarchar](100) NULL
) ON [PRIMARY]
GO
