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
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[app].[FK_AppLog_App_AppId]') AND parent_object_id = OBJECT_ID(N'[app].[AppLog]'))
ALTER TABLE [app].[AppLog] DROP CONSTRAINT [FK_AppLog_App_AppId]
GO
/****** Object:  Table [app].[AppLog]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[app].[AppLog]') AND type in (N'U'))
DROP TABLE [app].[AppLog]
GO
/****** Object:  Table [app].[AppLog]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [app].[AppLog](
	[AppLogId] [int] IDENTITY(1,1) NOT NULL,
	[AppId] [int] NOT NULL,
	[Level] [nvarchar](50) NULL,
	[Logger] [nvarchar](255) NULL,
	[UserName] [nvarchar](255) NULL,
	[MachineName] [nvarchar](255) NULL,
	[LoggedOn] [datetime2](7) NULL,
	[Thread] [nvarchar](50) NULL,
	[Message] [nvarchar](max) NULL,
	[CallSite] [nvarchar](max) NULL,
	[Exception] [nvarchar](max) NULL,
	[StackTrace] [nvarchar](max) NULL,
 CONSTRAINT [PK_AppLog] PRIMARY KEY CLUSTERED 
(
	[AppLogId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [app].[AppLog]  WITH CHECK ADD  CONSTRAINT [FK_AppLog_App_AppId] FOREIGN KEY([AppId])
REFERENCES [app].[App] ([AppId])
ON DELETE CASCADE
GO
ALTER TABLE [app].[AppLog] CHECK CONSTRAINT [FK_AppLog_App_AppId]
GO
