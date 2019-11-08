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
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__Attribute__ReadO__04E4BC85]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Attributes] DROP CONSTRAINT [DF__Attribute__ReadO__04E4BC85]
END
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__Attribute__Enabl__03F0984C]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Attributes] DROP CONSTRAINT [DF__Attribute__Enabl__03F0984C]
END
GO
/****** Object:  Table [dbo].[Attributes]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Attributes]') AND type in (N'U'))
DROP TABLE [dbo].[Attributes]
GO
/****** Object:  Table [dbo].[Attributes]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Attributes](
	[AttributeId] [int] IDENTITY(1,1) NOT NULL,
	[AttributeName] [nvarchar](50) NULL,
	[Pattern] [nvarchar](50) NULL,
	[Enabled] [bit] NOT NULL,
	[ReadOnly] [bit] NOT NULL,
 CONSTRAINT [PK_Attributes] PRIMARY KEY CLUSTERED 
(
	[AttributeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Attributes] ADD  DEFAULT ((0)) FOR [Enabled]
GO
ALTER TABLE [dbo].[Attributes] ADD  DEFAULT ((0)) FOR [ReadOnly]
GO
