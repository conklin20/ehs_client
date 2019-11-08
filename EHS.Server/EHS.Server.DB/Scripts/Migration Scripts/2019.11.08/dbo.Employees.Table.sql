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
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Employees_Employees_SupervisorId]') AND parent_object_id = OBJECT_ID(N'[dbo].[Employees]'))
ALTER TABLE [dbo].[Employees] DROP CONSTRAINT [FK_Employees_Employees_SupervisorId]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__Employees__POET__151B244E]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Employees] DROP CONSTRAINT [DF__Employees__POET__151B244E]
END
GO
/****** Object:  Index [IX_Employees_SupervisorId]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[Employees]') AND name = N'IX_Employees_SupervisorId')
DROP INDEX [IX_Employees_SupervisorId] ON [dbo].[Employees]
GO
/****** Object:  Table [dbo].[Employees]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Employees]') AND type in (N'U'))
DROP TABLE [dbo].[Employees]
GO
/****** Object:  Table [dbo].[Employees]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Employees](
	[EmployeeId] [nvarchar](50) NOT NULL,
	[FirstName] [nvarchar](100) NOT NULL,
	[LastName] [nvarchar](100) NOT NULL,
	[BirthDate] [date] NULL,
	[Sex] [nvarchar](15) NULL,
	[SupervisorId] [nvarchar](50) NULL,
	[LastUpdatedOn] [datetime2](7) NOT NULL,
	[POET] [bit] NULL,
	[Active] [bit] NOT NULL,
	[Email] [nvarchar](100) NULL,
	[HierarchyId] [int] NULL,
	[IsSupervisor] [bit] NULL,
 CONSTRAINT [PK_Employees] PRIMARY KEY CLUSTERED 
(
	[EmployeeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Employees_SupervisorId]    Script Date: 11/8/2019 10:32:39 AM ******/
CREATE NONCLUSTERED INDEX [IX_Employees_SupervisorId] ON [dbo].[Employees]
(
	[SupervisorId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF__Employees__POET__151B244E]  DEFAULT ((0)) FOR [POET]
GO
ALTER TABLE [dbo].[Employees]  WITH CHECK ADD  CONSTRAINT [FK_Employees_Employees_SupervisorId] FOREIGN KEY([SupervisorId])
REFERENCES [dbo].[Employees] ([EmployeeId])
GO
ALTER TABLE [dbo].[Employees] CHECK CONSTRAINT [FK_Employees_Employees_SupervisorId]
GO
