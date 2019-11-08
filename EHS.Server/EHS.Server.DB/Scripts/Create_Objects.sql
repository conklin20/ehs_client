USE [master]
GO
/****** Object:  Database [EHS_Dev]    Script Date: 11/7/2019 7:09:26 PM ******/
CREATE DATABASE [EHS_Dev]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'EHS_Dev', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\EHS_Dev.mdf' , SIZE = 1122304KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'EHS_Dev_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\EHS_Dev_log.ldf' , SIZE = 5709824KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [EHS_Dev] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [EHS_Dev].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [EHS_Dev] SET ANSI_NULL_DEFAULT ON 
GO
ALTER DATABASE [EHS_Dev] SET ANSI_NULLS ON 
GO
ALTER DATABASE [EHS_Dev] SET ANSI_PADDING ON 
GO
ALTER DATABASE [EHS_Dev] SET ANSI_WARNINGS ON 
GO
ALTER DATABASE [EHS_Dev] SET ARITHABORT ON 
GO
ALTER DATABASE [EHS_Dev] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [EHS_Dev] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [EHS_Dev] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [EHS_Dev] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [EHS_Dev] SET CURSOR_DEFAULT  LOCAL 
GO
ALTER DATABASE [EHS_Dev] SET CONCAT_NULL_YIELDS_NULL ON 
GO
ALTER DATABASE [EHS_Dev] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [EHS_Dev] SET QUOTED_IDENTIFIER ON 
GO
ALTER DATABASE [EHS_Dev] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [EHS_Dev] SET  DISABLE_BROKER 
GO
ALTER DATABASE [EHS_Dev] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [EHS_Dev] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [EHS_Dev] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [EHS_Dev] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [EHS_Dev] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [EHS_Dev] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [EHS_Dev] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [EHS_Dev] SET RECOVERY FULL 
GO
ALTER DATABASE [EHS_Dev] SET  MULTI_USER 
GO
ALTER DATABASE [EHS_Dev] SET PAGE_VERIFY NONE  
GO
ALTER DATABASE [EHS_Dev] SET DB_CHAINING OFF 
GO
ALTER DATABASE [EHS_Dev] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [EHS_Dev] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
ALTER DATABASE [EHS_Dev] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'EHS_Dev', N'ON'
GO
ALTER DATABASE [EHS_Dev] SET QUERY_STORE = OFF
GO
USE [EHS_Dev]
GO
/****** Object:  Schema [app]    Script Date: 11/7/2019 7:09:26 PM ******/
CREATE SCHEMA [app]
GO
/****** Object:  UserDefinedTableType [dbo].[CausesTableType]    Script Date: 11/7/2019 7:09:26 PM ******/
CREATE TYPE [dbo].[CausesTableType] AS TABLE(
	[EventId] [int] NOT NULL,
	[CauseId] [int] NOT NULL,
	[Comments] [nvarchar](max) NULL
)
GO
/****** Object:  UserDefinedTableType [dbo].[HierarchyTableType]    Script Date: 11/7/2019 7:09:26 PM ******/
CREATE TYPE [dbo].[HierarchyTableType] AS TABLE(
	[HierarchyId] [int] NULL,
	[HierarchyName] [nvarchar](100) NOT NULL,
	[Lft] [int] NOT NULL,
	[Rgt] [int] NOT NULL,
	[HierarchyLevelId] [int] NOT NULL
)
GO
/****** Object:  UserDefinedTableType [dbo].[PeopleInvolvedTableType]    Script Date: 11/7/2019 7:09:26 PM ******/
CREATE TYPE [dbo].[PeopleInvolvedTableType] AS TABLE(
	[RoleId] [int] NOT NULL,
	[EventId] [int] NOT NULL,
	[EmployeeId] [nvarchar](50) NOT NULL,
	[Comments] [nvarchar](max) NULL
)
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetEventSeverity]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CC
-- Create date: 10/10/2019
-- Description:	Get the severity of an event given the event result 
-- =============================================
CREATE FUNCTION [dbo].[fnGetEventSeverity] 
(
	@Result nvarchar(50) 
)
RETURNS int
AS
BEGIN
	-- Declare the return variable here
	DECLARE @Severity int 

	-- Add the T-SQL statements to compute the return value here
	SELECT @Severity = rs.SeverityId
	from HierarchyAttributes ha
		 join ResultSeverities rs on rs.HierarchyAttributeId = ha.HierarchyAttributeId
	where ha.[Value] = @Result
		 and ha.[Key] in ('Initial Category', 'Resulting Category')
		 and rs.Enabled = 1

	-- Return the result of the function
	RETURN @Severity 

END
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetHierarchyIdByName]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 11/6/2019
-- Description:	Gets a hierarchy id by the HierarchyName
-- =============================================
CREATE FUNCTION [dbo].[fnGetHierarchyIdByName]
(
	@HierarchyName nvarchar(50) 
)
RETURNS int
AS
BEGIN
	-- Declare the return variable here
	DECLARE @HierarchyId int

	-- Add the T-SQL statements to compute the return value here
	select @HierarchyId = HierarchyId 
	from Hierarchies 
	where HierarchyName = @HierarchyName

	-- Return the result of the function
	RETURN @HierarchyId

END
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetHierarchyNameById]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CC
-- Create date: 11/6/2019
-- Description:	Gets a hierarchy name by the HierarchyId
-- =============================================
CREATE FUNCTION [dbo].[fnGetHierarchyNameById]
(
	@HierarchyId int 
)
RETURNS nvarchar(50)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @HierarchyName nvarchar(50)

	-- Add the T-SQL statements to compute the return value here
	select @HierarchyName = HierarchyName 
	from Hierarchies 
	where HierarchyId = @HierarchyId

	-- Return the result of the function
	RETURN @HierarchyName

END
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetUserContext]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CC
-- Create date: 10/9/2019
-- Description:	Read user Context_Info for auditing 
-- =============================================
CREATE FUNCTION [dbo].[fnGetUserContext]()

RETURNS nvarchar(50)
AS
BEGIN
	declare @userId nvarchar(50)

	IF CONTEXT_INFO() IS NOT NULL 
		select @userId = convert(nvarchar(50), CONTEXT_INFO())
	else 
		select @userId = suser_name()

	-- Return the result of the function
	return @userId

END
GO
/****** Object:  UserDefinedFunction [dbo].[fnSiteAreaDeptTOHierarchyIdMapper]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CC
-- Create date: 07/27/2019
-- Description:	maps legacy siteareadeptId to new hierarchyId
-- select * from dbo.fnGetHierarchyFullTree(4001)
-- =============================================
CREATE FUNCTION [dbo].[fnSiteAreaDeptTOHierarchyIdMapper]
(
	-- Add the parameters for the function here
	@SiteAreaDeptId nvarchar(4)  
)
RETURNS int
AS
BEGIN
	-- Declare the return variable here
	DECLARE @HierarchyId int 

	-- Add the T-SQL statements to compute the return value here
	set @HierarchyId = (
		select h.HierarchyId
		from Hierarchies h 
			 join HierarchyLevels l on l.HierarchyLevelId = h.HierarchyLevelId
		where l.HierarchyLevelName = 'Logical_5' and h.Lft > 0
			 and replace(right(h.HierarchyName, charindex('(', reverse(h.HierarchyName) + '(') - 1), ')', '') = @SiteAreaDeptId 
	)

	-- Return the result of the function
	return @HierarchyId

END
GO
/****** Object:  UserDefinedFunction [dbo].[fnSiteAreaTOHierarchyIdMapper]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CC
-- Create date: 07/27/2019
-- Description:	maps legacy siteareaId to new hierarchyId
-- select * from dbo.fnGetHierarchyFullTree(4001)
-- =============================================
CREATE FUNCTION [dbo].[fnSiteAreaTOHierarchyIdMapper]
(
	-- Add the parameters for the function here
	@SiteAreaId int 
)
RETURNS int
AS
BEGIN
	-- Declare the return variable here
	DECLARE @HierarchyId int 

	-- Add the T-SQL statements to compute the return value here
	set @HierarchyId = (
		select case 
			when @SiteAreaId in (49,59,60,163,164) then 5003 --Centerfire
			when @SiteAreaId in (53,54,55,56) then 5004 --Primers
			when @SiteAreaId in (48,50,51) then 5005 --Rimfire
			when @SiteAreaId in (61,62,64,66,67,68,69,80,81,83,151,160,174,175,177,178,179,180,181,182,185,186,187,369,370,371,70,184) then 6046 --Support (Mfg)
			when @SiteAreaId in (72,73,131,172,173,176,205,206,207,208,209,296,297,298,299,315,316,317,372,419,420,421,581) then 6090 --Support (Other)
			else -1 end
	)

	-- Return the result of the function
	return @HierarchyId

END
GO
/****** Object:  Table [dbo].[HierarchyLevels]    Script Date: 11/7/2019 7:09:26 PM ******/
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
/****** Object:  Table [dbo].[Hierarchies]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Hierarchies](
	[HierarchyId] [int] IDENTITY(1,1) NOT NULL,
	[HierarchyName] [nvarchar](50) NOT NULL,
	[Lft] [int] NOT NULL,
	[Rgt] [int] NOT NULL,
	[HierarchyLevelId] [int] NOT NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[CreatedBy] [nvarchar](50) NOT NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Hierarchies] PRIMARY KEY CLUSTERED 
(
	[HierarchyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetHierarchyFullTree]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 08/05/2019
-- Description:	selects the full tree of items within the hierarchy from the root HierarchyId provided 
-- =============================================
CREATE FUNCTION [dbo].[fnGetHierarchyFullTree]
(	
	@HierarchyId int
)
RETURNS TABLE 
AS
RETURN 
(
	select h.* --HierarchyId, h.HierarchyName, l.HierarchyLevel 
	from Hierarchies h
		 join Hierarchies hp on h.Lft between hp.Lft and hp.Rgt and hp.[HierarchyId] = @HierarchyId
		 join HierarchyLevels l on l.HierarchyLevelId = h.HierarchyLevelId
		 and h.Lft > 0
)
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetHierarchyLeafNodes]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 08/05/2019
-- Description:	selects all leaf nodes in the hierarchy, given Logical or Physical 
-- =============================================
CREATE FUNCTION [dbo].[fnGetHierarchyLeafNodes]
(	
	@LevelName nvarchar(20)
)
RETURNS TABLE 
AS
RETURN 
(
	select h.* --HierarchyId, h.HierarchyName, l.HierarchyLevel, l.HierarchyLevelName 
	from Hierarchies h
		 join HierarchyLevels l on l.HierarchyLevelId = h.HierarchyLevelId
	where h.Rgt = h.Lft + 1
		 and l.HierarchyLevelName = @LevelName 
		 and h.Lft > 0
		
)
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetHierarchySinglePath]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 08/05/2019
-- Description:	selects the single path of a node. This will be used to populate the lookup data dropdowns 
-- =============================================
CREATE FUNCTION [dbo].[fnGetHierarchySinglePath]
(	
	@HierarchyId int --Theoretically, this should always be a 600 (highest) level hierarchyId (Department of PlantArea) 
)
RETURNS TABLE 
AS
RETURN 
(
	select hp.*--HierarchyId, hp.HierarchyName, l.HierarchyLevel
	from Hierarchies h
		 join Hierarchies hp on h.Lft between hp.Lft and hp.Rgt and h.[HierarchyId] = @HierarchyId
		 join HierarchyLevels l on l.HierarchyLevelId = hp.HierarchyLevelId
		 and h.Lft > 0
)
GO
/****** Object:  Table [app].[App]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [app].[App](
	[AppId] [int] IDENTITY(1,1) NOT NULL,
	[AppName] [nvarchar](50) NOT NULL,
	[Active] [bit] NOT NULL,
 CONSTRAINT [PK_App] PRIMARY KEY CLUSTERED 
(
	[AppId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [app].[AppLog]    Script Date: 11/7/2019 7:09:26 PM ******/
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
/****** Object:  Table [app].[AuditLog]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [app].[AuditLog](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TimestampUtc] [datetime] NOT NULL,
	[EventType] [nvarchar](10) NOT NULL,
	[TableRef] [nvarchar](50) NOT NULL,
	[RecordId] [int] NOT NULL,
	[Record] [nvarchar](max) NULL,
	[UserId] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_AuditLog] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Actions]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Actions](
	[ActionId] [int] IDENTITY(1,1) NOT NULL,
	[EventId] [int] NOT NULL,
	[EventType] [nvarchar](50) NOT NULL,
	[AssignedTo] [nvarchar](50) NULL,
	[ActionToTake] [nvarchar](max) NOT NULL,
	[ActionType] [nvarchar](50) NOT NULL,
	[DueDate] [datetime2](7) NOT NULL,
	[CompletionDate] [datetime2](7) NULL,
	[ApprovalDate] [datetime2](7) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[CreatedBy] [nvarchar](50) NOT NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Actions] PRIMARY KEY CLUSTERED 
(
	[ActionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ApprovalRoutings]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ApprovalRoutings](
	[ApprovalRoutingId] [int] IDENTITY(1,1) NOT NULL,
	[SeverityId] [int] NOT NULL,
	[UserRoleId] [int] NOT NULL,
	[ApprovalLevelName] [nvarchar](50) NOT NULL,
	[ApprovalLevel] [int] NOT NULL,
	[Enabled] [bit] NOT NULL,
 CONSTRAINT [PK_ApprovalRoutings] PRIMARY KEY CLUSTERED 
(
	[ApprovalRoutingId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Approvals]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Approvals](
	[ApprovalId] [int] IDENTITY(1,1) NOT NULL,
	[ActionId] [int] NOT NULL,
	[ApprovalLevelId] [int] NOT NULL,
	[ApprovedBy] [nvarchar](50) NULL,
	[ApprovedOn] [datetime2](7) NOT NULL,
	[Notes] [nvarchar](255) NULL,
 CONSTRAINT [PK_Approvals] PRIMARY KEY CLUSTERED 
(
	[ApprovalId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Attributes]    Script Date: 11/7/2019 7:09:26 PM ******/
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
/****** Object:  Table [dbo].[Employees]    Script Date: 11/7/2019 7:09:26 PM ******/
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
/****** Object:  Table [dbo].[EventCauses]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EventCauses](
	[EventCauseId] [int] IDENTITY(1,1) NOT NULL,
	[EventId] [int] NOT NULL,
	[CauseId] [int] NOT NULL,
	[Comments] [nvarchar](2000) NULL,
 CONSTRAINT [PK_EventCauses] PRIMARY KEY CLUSTERED 
(
	[EventCauseId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EventFiles]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EventFiles](
	[EventFileId] [int] IDENTITY(1,1) NOT NULL,
	[EventId] [int] NOT NULL,
	[UserId] [nvarchar](50) NOT NULL,
	[ServerFileName] [nvarchar](250) NOT NULL,
	[UserFileName] [nvarchar](250) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
 CONSTRAINT [PK_EventFiles] PRIMARY KEY CLUSTERED 
(
	[EventFileId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[HierarchyAttributes]    Script Date: 11/7/2019 7:09:26 PM ******/
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
/****** Object:  Table [dbo].[InitEmpFile]    Script Date: 11/7/2019 7:09:26 PM ******/
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
/****** Object:  Table [dbo].[PeopleInvolved]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PeopleInvolved](
	[PeopleInvolvedId] [int] IDENTITY(1,1) NOT NULL,
	[RoleId] [int] NOT NULL,
	[EventId] [int] NOT NULL,
	[EmployeeId] [nvarchar](50) NULL,
	[Comments] [nvarchar](2000) NULL,
 CONSTRAINT [PK_PeopleInvolved] PRIMARY KEY CLUSTERED 
(
	[PeopleInvolvedId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ResultSeverities]    Script Date: 11/7/2019 7:09:26 PM ******/
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
/****** Object:  Table [dbo].[SafetyEvents]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SafetyEvents](
	[EventId] [int] IDENTITY(1,1) NOT NULL,
	[EventType] [nvarchar](50) NOT NULL,
	[EventStatus] [nvarchar](50) NOT NULL,
	[ReportedBy] [nvarchar](50) NOT NULL,
	[ReportedOn] [datetime2](7) NOT NULL,
	[EventDate] [datetime] NULL,
	[EmployeeId] [nvarchar](50) NULL,
	[JobTitle] [nvarchar](50) NULL,
	[Shift] [nvarchar](50) NULL,
	[WhatHappened] [nvarchar](max) NULL,
	[IsInjury] [bit] NULL,
	[IsIllness] [bit] NULL,
	[HoursWorkedPrior] [decimal](3, 1) NULL,
	[InitialCategory] [nvarchar](50) NULL,
	[ResultingCategory] [nvarchar](50) NULL,
	[Division] [nvarchar](50) NULL,
	[Site] [nvarchar](50) NULL,
	[Area] [nvarchar](50) NULL,
	[Department] [nvarchar](50) NULL,
	[LocaleRegion] [nvarchar](50) NULL,
	[LocaleSite] [nvarchar](50) NULL,
	[LocalePlant] [nvarchar](50) NULL,
	[LocalePlantArea] [nvarchar](50) NULL,
	[WorkEnvironment] [nvarchar](50) NULL,
	[NatureOfInjury] [nvarchar](50) NULL,
	[BodyPart] [nvarchar](50) NULL,
	[FirstAidType] [nvarchar](50) NULL,
	[OffPlantMedicalFacility] [nvarchar](50) NULL,
	[MaterialInvolved] [nvarchar](50) NULL,
	[EquipmentInvolved] [nvarchar](50) NULL,
	[LostTime] [bit] NULL,
	[FirstAid] [bit] NULL,
	[Transported] [bit] NULL,
	[ER] [bit] NULL,
	[PassedPOET] [bit] NULL,
	[RecordedOnVideo] [bit] NULL,
	[CameraId] [int] NULL,
	[VideoStartRef] [datetime2](7) NULL,
	[VideoEndRef] [datetime2](7) NULL,
	[DepartmentId] [int] NULL,
	[LocaleId] [int] NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[CreatedBy] [nvarchar](50) NOT NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](50) NOT NULL,
	[LegacyIncidentId] [int] NULL,
 CONSTRAINT [PK_SafetyEvents] PRIMARY KEY CLUSTERED 
(
	[EventId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Severities]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Severities](
	[SeverityId] [int] IDENTITY(1,1) NOT NULL,
	[SeverityName] [nvarchar](50) NOT NULL,
	[SeverityDescription] [nvarchar](255) NOT NULL,
	[Enabled] [bit] NOT NULL,
 CONSTRAINT [PK_Severities] PRIMARY KEY CLUSTERED 
(
	[SeverityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserRoles]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserRoles](
	[UserRoleId] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [nvarchar](50) NOT NULL,
	[RoleCapabilities] [nvarchar](255) NOT NULL,
	[RoleLevel] [smallint] NOT NULL,
 CONSTRAINT [PK_UserRoles] PRIMARY KEY CLUSTERED 
(
	[UserRoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserId] [nvarchar](50) NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
	[FirstName] [nvarchar](100) NOT NULL,
	[LastName] [nvarchar](100) NOT NULL,
	[LogicalHierarchyId] [int] NOT NULL,
	[PhysicalHierarchyId] [int] NOT NULL,
	[Phone] [nvarchar](20) NULL,
	[RoleId] [int] NULL,
	[TimeZone] [nvarchar](50) NULL,
	[DateFormat] [nvarchar](50) NULL,
	[CreatedOn] [datetime2](7) NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[ModifiedOn] [datetime2](7) NULL,
	[ModifiedBy] [nvarchar](50) NULL,
	[Enabled] [bit] NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Index [IX_ApprovalRoutings_SeverityId]    Script Date: 11/7/2019 7:09:26 PM ******/
CREATE NONCLUSTERED INDEX [IX_ApprovalRoutings_SeverityId] ON [dbo].[ApprovalRoutings]
(
	[SeverityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_ApprovalRoutings_UserRoleId]    Script Date: 11/7/2019 7:09:26 PM ******/
CREATE NONCLUSTERED INDEX [IX_ApprovalRoutings_UserRoleId] ON [dbo].[ApprovalRoutings]
(
	[UserRoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Employees_SupervisorId]    Script Date: 11/7/2019 7:09:26 PM ******/
CREATE NONCLUSTERED INDEX [IX_Employees_SupervisorId] ON [dbo].[Employees]
(
	[SupervisorId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Hierarchies_HierarchyLevelId]    Script Date: 11/7/2019 7:09:26 PM ******/
CREATE NONCLUSTERED INDEX [IX_Hierarchies_HierarchyLevelId] ON [dbo].[Hierarchies]
(
	[HierarchyLevelId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_HierarchyAttributes_AttributeId]    Script Date: 11/7/2019 7:09:26 PM ******/
CREATE NONCLUSTERED INDEX [IX_HierarchyAttributes_AttributeId] ON [dbo].[HierarchyAttributes]
(
	[AttributeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_HierarchyAttributes_HierarchyId]    Script Date: 11/7/2019 7:09:26 PM ******/
CREATE NONCLUSTERED INDEX [IX_HierarchyAttributes_HierarchyId] ON [dbo].[HierarchyAttributes]
(
	[HierarchyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_ResultSeverities_HierarchyAttributeId]    Script Date: 11/7/2019 7:09:26 PM ******/
CREATE NONCLUSTERED INDEX [IX_ResultSeverities_HierarchyAttributeId] ON [dbo].[ResultSeverities]
(
	[HierarchyAttributeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_ResultSeverities_SeverityId]    Script Date: 11/7/2019 7:09:26 PM ******/
CREATE NONCLUSTERED INDEX [IX_ResultSeverities_SeverityId] ON [dbo].[ResultSeverities]
(
	[SeverityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Attributes] ADD  DEFAULT ((0)) FOR [Enabled]
GO
ALTER TABLE [dbo].[Attributes] ADD  DEFAULT ((0)) FOR [ReadOnly]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF__Employees__POET__151B244E]  DEFAULT ((0)) FOR [POET]
GO
ALTER TABLE [dbo].[EventFiles] ADD  CONSTRAINT [DF_EventFiles_CreatedOn]  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[SafetyEvents] ADD  CONSTRAINT [DF__SafetyEve__Depar__74AE54BC]  DEFAULT ((0)) FOR [DepartmentId]
GO
ALTER TABLE [dbo].[SafetyEvents] ADD  CONSTRAINT [DF__SafetyEve__Local__75A278F5]  DEFAULT ((0)) FOR [LocaleId]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_Enabled]  DEFAULT ((1)) FOR [Enabled]
GO
ALTER TABLE [app].[AppLog]  WITH CHECK ADD  CONSTRAINT [FK_AppLog_App_AppId] FOREIGN KEY([AppId])
REFERENCES [app].[App] ([AppId])
ON DELETE CASCADE
GO
ALTER TABLE [app].[AppLog] CHECK CONSTRAINT [FK_AppLog_App_AppId]
GO
ALTER TABLE [dbo].[ApprovalRoutings]  WITH CHECK ADD  CONSTRAINT [FK_ApprovalRoutings_Severities_SeverityId] FOREIGN KEY([SeverityId])
REFERENCES [dbo].[Severities] ([SeverityId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ApprovalRoutings] CHECK CONSTRAINT [FK_ApprovalRoutings_Severities_SeverityId]
GO
ALTER TABLE [dbo].[ApprovalRoutings]  WITH CHECK ADD  CONSTRAINT [FK_ApprovalRoutings_UserRoles_UserRoleId] FOREIGN KEY([UserRoleId])
REFERENCES [dbo].[UserRoles] ([UserRoleId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ApprovalRoutings] CHECK CONSTRAINT [FK_ApprovalRoutings_UserRoles_UserRoleId]
GO
ALTER TABLE [dbo].[Employees]  WITH CHECK ADD  CONSTRAINT [FK_Employees_Employees_SupervisorId] FOREIGN KEY([SupervisorId])
REFERENCES [dbo].[Employees] ([EmployeeId])
GO
ALTER TABLE [dbo].[Employees] CHECK CONSTRAINT [FK_Employees_Employees_SupervisorId]
GO
ALTER TABLE [dbo].[Hierarchies]  WITH CHECK ADD  CONSTRAINT [FK_Hierarchies_HierarchyLevels_HierarchyLevelId] FOREIGN KEY([HierarchyLevelId])
REFERENCES [dbo].[HierarchyLevels] ([HierarchyLevelId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Hierarchies] CHECK CONSTRAINT [FK_Hierarchies_HierarchyLevels_HierarchyLevelId]
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
/****** Object:  StoredProcedure [dbo].[spActionAddOrUpdate]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Add or Update operations for the Action Table
-- Select * from dbo.Actions
-- =============================================
CREATE PROCEDURE [dbo].[spActionAddOrUpdate] 
	@ActionId	int = null,
	@EventId	int,
	@EventType	nvarchar(50),
	@AssignedTo	nvarchar(50),
	@ActionToTake	nvarchar(MAX),
	@ActionType	nvarchar(50),
	@DueDate	datetime2,
	@CompletionDate	datetime2 = null,
	@ApprovalDate	datetime2 = null, 
	@UserId nvarchar(50) 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId

    if(@ActionId is null) 
	begin 
		print 'Insert new action'
		INSERT INTO dbo.Actions
           (EventId
           ,EventType
           ,AssignedTo
           ,ActionToTake
           ,ActionType
           ,DueDate
           ,CompletionDate
           ,ApprovalDate
		   ,CreatedOn
           ,CreatedBy
           ,ModifiedOn
           ,ModifiedBy)
		VALUES
           (@EventId
           ,@EventType
           ,@AssignedTo
           ,@ActionToTake
           ,@ActionType
           ,@DueDate
           ,@CompletionDate
           ,@ApprovalDate
		   ,GETUTCDATE()
           ,@UserId
		   ,GETUTCDATE()
           ,@UserId)
	end
	else 
	begin 
		print 'Update existing action'
		update Actions 
		set EventId = @EventId, 
			EventType = @EventType, 
			AssignedTo = @AssignedTo, 
			ActionToTake = @ActionToTake, 
			ActionType = @ActionType, 
			DueDate = @DueDate, 
			CompletionDate = @CompletionDate, 
			ApprovalDate = @ApprovalDate, 
			ModifiedOn = GETUTCDATE(), 
			ModifiedBy = @UserId
		where ActionId = @ActionId 
	end
END
GO
/****** Object:  StoredProcedure [dbo].[spActionDelete]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Delete operation for the Action Table
-- =============================================
CREATE PROCEDURE [dbo].[spActionDelete]
	@ActionId	int,
	@UserId nvarchar(50) 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId

	delete from Actions where ActionId = @ActionId

END
GO
/****** Object:  StoredProcedure [dbo].[spApprovalAddOrUpdate]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Add or Update operations for the Approvals Table
-- Select * from dbo.Approvals
-- =============================================
CREATE PROCEDURE [dbo].[spApprovalAddOrUpdate] 
	@ActionId	int,
	@ApprovedBy	nvarchar(50),
	@ApprovedOn	datetime2,
	@UserId nvarchar(50) 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId

	
	BEGIN TRY
		BEGIN TRANSACTION 
		
			declare @EventId int = (select EventId from Actions a where a.ActionId = @ActionId) 
			declare @Severity int = (select dbo.fnGetEventSeverity(isnull(e.ResultingCategory, e.InitialCategory)) from SafetyEvents e where e.EventId = @EventId)
			declare @UserRoleId int = (select RoleId from Users u where u.UserId = @UserId)
			declare @ApprovalLevelId int = (select ar.ApprovalLevel
									from Users u 
										 join ApprovalRoutings ar on ar.UserRoleId = u.RoleId
									where u.UserId = @UserId and ar.SeverityId = @Severity)
	
			--insert aprroval 
			if not exists (select a.ApprovalId from Approvals a where a.ActionId = @ActionId and a.ApprovalLevelId = @ApprovalLevelId) 
			begin
				INSERT INTO [dbo].[Approvals]
				   ([ActionId]
				   ,[ApprovalLevelId]
				   ,[ApprovedBy]
				   ,[ApprovedOn])
				   --,[Notes])
				 VALUES
					   (@ActionId
					   ,@ApprovalLevelId
					   ,@ApprovedBy
					   ,@ApprovedOn)
			end
						
			--if action has received all necessary approvals, mark overall action as approved 
			declare @ApprovalsNeeded int, @ApprovalsReceived int 

			select @ApprovalsNeeded = count(ar.ApprovalLevel) 
				  ,@ApprovalsReceived = count(ap.ApprovalId)
			from SafetyEvents e 
				 join ApprovalRoutings ar on ar.SeverityId = dbo.fnGetEventSeverity(isnull(e.ResultingCategory, e.InitialCategory)) 
				 left join Approvals ap on ap.ApprovalLevelId = ar.ApprovalLevel and ap.ActionId = @ActionId
			where e.EventId = @EventId 

			--select @ApprovalsNeeded, @ApprovalsReceived
			if (@ApprovalsNeeded = @ApprovalsReceived)
			begin 
				--set action as approved 
				update Actions
				set ApprovalDate = @ApprovedOn
				where ActionId = @ActionId
			end

		--commit the transaction 
		COMMIT
		return 1
	END TRY
	BEGIN CATCH		
		IF @@TRANCOUNT > 0
			ROLLBACK
			return 0
	END CATCH

END
GO
/****** Object:  StoredProcedure [dbo].[spApprovalDelete]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Delete operation for the Approvals Table
-- =============================================
CREATE PROCEDURE [dbo].[spApprovalDelete]
	@ApprovalId	int,
	@UserId nvarchar(50) 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
    print 'Delete approval' 
	delete from Approvals where ApprovalId = @ApprovalId 
END
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeRefresh]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CC
-- Create date: 9/26/2019
-- Description:	Updates the Employees table from source (WorkDay/JobPref db) 
-- =============================================
CREATE PROCEDURE [dbo].[spEmployeeRefresh]

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	if OBJECT_ID('tempdb..#WDEmployeeImport') is not null 
	drop table #WDEmployeeImport

	create table #WDEmployeeImport
	(
		[EmployeeId] [nvarchar](50) NOT NULL,
		[FirstName] [nvarchar](100) NOT NULL,
		[LastName] [nvarchar](100) NOT NULL,
		[BirthDate] [date] NULL,
		[Sex] [nvarchar](15) NULL,
		[SupervisorId] [nvarchar](50) NULL,
		[LastUpdatedOn] [datetime2](7) NOT NULL,
		--[POET] [bit] NULL,
		[Active] [bit] NOT NULL,
		[Email] [nvarchar](100) NULL,
		[Location] [nvarchar](50) NULL
	 CONSTRAINT [PK_Employees_tmp] PRIMARY KEY CLUSTERED 
	(
		[EmployeeId] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]

	BULK INSERT #WDEmployeeImport
	FROM 'C:\Users\caryc\Projects\Vista Outdoor\EHS\WDEmployeeExtract.txt'
	WITH 
	(
		FIRSTROW = 2, 
		FIELDTERMINATOR = '|'
		--ROWTERMINATOR = '0x0a'
	)

	--merge statement to insert new records or update existing 
	merge dbo.Employees with (updlock, rowlock) t
	using 
		(
			select EmployeeId, FirstName, LastName, BirthDate, Sex, SupervisorId, LastUpdatedOn, Active, Email, [Location]
			from #WDEmployeeImport 
		) s 
		on t.EmployeeId = s.EmployeeId
	when matched then 
		update 
		set t.FirstName = s.FirstName, 
			t.LastName = s.LastName, 
			t.BirthDate = s.BirthDate, 
			t.Sex = s.Sex, 
			t.SupervisorId = s.SupervisorId, 
			t.LastUpdatedOn = getutcdate(),
			t.Active = s.Active,
			t.Email = s.Email, 
			t.[HierarchyId] = case when [Location] = 'ID01' then 4001 -- Lewiston
								   else null end
	when not matched then 
		insert (EmployeeId
				, FirstName
				, LastName
				, BirthDate
				, Sex
				, SupervisorId
				, LastUpdatedOn
				, Active
				, Email
				, [HierarchyId])  
		values (s.EmployeeId
				, s.FirstName
				, s.LastName
				, s.BirthDate
				, s.Sex
				, s.SupervisorId
				, getutcdate()
				, s.Active
				, s.Email
				, case when [Location] = 'ID01' then 4001 -- Lewiston
								   else null end   );

	--set the IsSupervisor bit 
	update s
	set s.IsSupervisor = 1 
	from Employees e 
		 join Employees s on e.SupervisorId = s.EmployeeId
	where s.Active = 1


	select * from Employees e --where e.EmployeeId = 71624

END
GO
/****** Object:  StoredProcedure [dbo].[spEventCauseMerge]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 8/2/2019
-- Description:	Add or Update operations for the EventCauses table
-- select * from dbo.EventCauses
-- =============================================
CREATE PROCEDURE [dbo].[spEventCauseMerge]
	@CausesTable dbo.CausesTableType READONLY, 
	@UserId nvarchar(50) 
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId
		
	merge dbo.EventCauses with (updlock, rowlock) t 
	using 
		(
			select EventId, CauseId, Comments
			from @CausesTable
		) s
		on  t.EventId = s.EventId and t.CauseId = s.CauseId
	when matched then 
		update 
		set Comments = s.Comments
	--when not matched and t.RoleId is not null then 
	--	delete
	when not matched and s.CauseId is not null then 
		insert (EventId, CauseId, Comments) 
		values (s.EventId, s.CauseId, s.Comments); 
		

	--delete records that didnt come in with the table param (cant use the merge statement for this) 
	declare @EventId int = (select top(1) EventId from @CausesTable)
	delete c
	from EventCauses c
		 left join @CausesTable c2 on c2.EventId = c.EventId and c2.CauseId = c.CauseId 
	where c.EventId = @EventId
		and c2.CauseId is null 
END
GO
/****** Object:  StoredProcedure [dbo].[spEventFileAddOrUpdate]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 10/23/2019
-- Description:	Add or Update operations for the  EventFiles table
-- select * from dbo.EventFiles
-- =============================================
CREATE PROCEDURE [dbo].[spEventFileAddOrUpdate]
	@EventId int,
	@UserId nvarchar(50), 
	@ServerFileName nvarchar(250), 
	@UserFileName nvarchar(250)
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId
	
	if not exists(select * from EventFiles ef where ef.EventId = @EventId and ef.UserId = @UserId and ef.ServerFileName = @ServerFileName)
	begin 
		insert into dbo.EventFiles 
		select @EventId, @UserId, @ServerFileName, @UserFileName, getutcdate()
	end
	else 
	begin 
		select 'File already exists'
	end

END
GO
/****** Object:  StoredProcedure [dbo].[spEventFileDelete]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 10/23/2019
-- Description:	Delete operations for the  EventFiles table
-- select * from dbo.EventFiles
-- =============================================
CREATE PROCEDURE [dbo].[spEventFileDelete]
	@EventFileId int,
	@UserId nvarchar(50)
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId
	
	if exists(select * from EventFiles ef where ef.EventFileId = @EventFileId)
	begin 
		delete EventFiles 
		where EventFileId = @EventFileId
	end
	else 
	begin 
		select 'File doesnt exists'
	end

END
GO
/****** Object:  StoredProcedure [dbo].[spHierarchyAddOrUpdate]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Add or Update operations for the Hierachy Table
-- =============================================
CREATE PROCEDURE [dbo].[spHierarchyAddOrUpdate] 
	@Hierarchy dbo.HierarchyTableType READONLY, 
	@LeftHierarchy dbo.HierarchyTableType READONLY,
	@FirstChild bit = 0, 
	@UserId nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
		
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId

	--Updating name of hierarchy only. 
	if(select HierarchyId from @Hierarchy) is not null
	begin 
		update h
		set h.HierarchyName = h2.HierarchyName, 
			h.ModifiedOn = getutcdate(), 
			h.ModifiedBy = @UserId
		from Hierarchies h 
			 join @Hierarchy h2 on h2.HierarchyId = h.Hierarchyid
		
	end
	else --if(select HierarchyId from @Hierarchy) is null
	begin 
		--new hierarchy 
		if(@FirstChild = 0)
		begin 
			declare @myRight int = (select Rgt from @LeftHierarchy) 

			update Hierarchies 
			set rgt = rgt + 2,
				ModifiedOn = getutcdate(), 
				ModifiedBy = @UserId
			where rgt > @myRight;

			update Hierarchies 
			set lft = lft + 2 ,
				ModifiedOn = getutcdate(), 
				ModifiedBy = @UserId
			where lft > @myRight;

			insert into Hierarchies(HierarchyName, lft, rgt, HierarchyLevelId, CreatedOn, CreatedBy, ModifiedOn, ModifiedBy) 
			select HierarchyName, @myRight + 1, @myRight + 2, HierarchyLevelId, getutcdate(), @UserId, getutcdate(), @UserId from @Hierarchy
		end 
		else 
		begin 
			declare @myLeft int = (select Lft from @LeftHierarchy) 

			update Hierarchies 
			set rgt = rgt + 2,
				ModifiedOn = getutcdate(), 
				ModifiedBy = @UserId
			where rgt > @myLeft;

			update Hierarchies 
			set lft = lft + 2,
				ModifiedOn = getutcdate(), 
				ModifiedBy = @UserId 
			where lft > @myLeft;

			insert into Hierarchies(HierarchyName, lft, rgt, HierarchyLevelId, CreatedOn, CreatedBy, ModifiedOn, ModifiedBy) 
			select HierarchyName, @myLeft + 1, @myLeft + 2, HierarchyLevelId, getutcdate(), @UserId, getutcdate(), @UserId from @Hierarchy
		end

		

	end 
    --select * from @NewHierarchy

END
GO
/****** Object:  StoredProcedure [dbo].[spHierarchyAttributeAddOrUpdate]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Add or Update operations for the HierachyAttribute Table
-- =============================================
CREATE PROCEDURE [dbo].[spHierarchyAttributeAddOrUpdate] 
	@HierarchyAttributeId int = null, 
	@HierarchyId int, 
	@AttributeId int, 
	@Key nvarchar(50), 
	@Value nvarchar(max), 
	@Enabled bit, 
	@UserId nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    if(@HierarchyAttributeId is null) 
	begin 
		insert into HierarchyAttributes 
		select @HierarchyId, @AttributeId, @Key, @Value, @Enabled, GETUTCDATE(), @UserId, GETUTCDATE(), @UserId
	end
	else 
	begin 
		update HierarchyAttributes 
		set [HierarchyId] = @HierarchyId
			,AttributeId = @AttributeId
			,[Key] = @Key
			,[Value] = @Value
			,[Enabled] = @Enabled
			,ModifiedOn = GETUTCDATE()
			,ModifiedBy = @UserId
		where HierarchyAttributeId = @HierarchyAttributeId
	end
END
GO
/****** Object:  StoredProcedure [dbo].[spHierarchyAttributeDelete]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Delete operation for the HierachyAttribute Table
-- =============================================
CREATE PROCEDURE [dbo].[spHierarchyAttributeDelete]
	@HierarchyAttributeId int,	
	@UserId nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
    print 'Delete hierarchyAttribute' 
	select @HierarchyAttributeId
	--INSERT INTO [app].[AppLog]
 --          ([AppId]
 --          ,[Level]
 --          ,[Logger]
 --          ,[UserName]
 --          ,[MachineName]
 --          ,[LoggedOn]
 --          ,[Thread]
 --          ,[Message]
 --          ,[CallSite]
 --          ,[Exception]
 --          ,[StackTrace])
 --    VALUES
 --          (1
 --          ,'Debug'
 --          ,'SQL'
 --          ,'caryc'
 --          ,@@SERVERNAME
 --          ,GETUTCDATE()
 --          ,0
 --          ,'spHierarchyDelete Stored proc was successfully called via Dapper!'
 --          ,''
 --          ,''
 --          ,'')
END
GO
/****** Object:  StoredProcedure [dbo].[spHierarchyDelete]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Delete operation for the Hierachy Table
-- =============================================
CREATE PROCEDURE [dbo].[spHierarchyDelete]
	--@HierarchyToDelete dbo.HierarchyTableType READONLY, 
	@HierarchyId int, 
	@UserId nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId
	
	declare @myLeft int, @myRight int, @myWidth int 
	select @myLeft = Lft, @myRight = Rgt, @myWidth = Rgt - Lft + 1
	from Hierarchies h 
	where h.HierarchyId = @HierarchyId
	--select @myLeft, @myRight, @myWidth

	--Not actually going to delete, just remove these from any hierarchy 
	update Hierarchies 
	set Lft = -1, 
		Rgt = -1
	where Lft between @myLeft and @myRight 
	--DELETE 
	--FROM Hierarchies
	--WHERE Lft BETWEEN @myLeft AND @myRight;

	--update the remaining affected hierarchies 
	update Hierarchies set rgt = rgt - @myWidth where rgt > @myRight;
	update Hierarchies set lft = lft - @myWidth where lft > @myRight;
END
GO
/****** Object:  StoredProcedure [dbo].[spLegacyIncidentMigration]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CC
-- Create date: 07/27/2019
-- Description:	script for migrating legacy incidents over to new database
-- =============================================
CREATE PROCEDURE [dbo].[spLegacyIncidentMigration]
	@TruncateTable bit = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
		
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext 'sysmigration'

	declare @utcoffset int = -8 --converting any dates in the legacy system to UTC

	if(@TruncateTable = 1)
	begin 
		--create temp tables for non-legacy data
		if(object_id('tempdb..#data_migration_events') is not null) drop table #data_migration_events
		if(object_id('tempdb..#data_migration_people') is not null) drop table #data_migration_people
		if(object_id('tempdb..#data_migration_actions') is not null) drop table #data_migration_actions
		if(object_id('tempdb..#data_migration_approvals') is not null) drop table #data_migration_approvals
		if(object_id('tempdb..#data_migration_files') is not null) drop table #data_migration_files

		select * 
		into #data_migration_events 
		from SafetyEvents
		where LegacyIncidentId is null

		select p.*
		into #data_migration_people
		from PeopleInvolved p 
			 join #data_migration_events e on e.EventId = p.EventId
			 
		select a.*
		into #data_migration_actions
		from Actions a
			 join #data_migration_events e on e.EventId = a.EventId
			 
		select a.*
		into #data_migration_approvals
		from Approvals a
			 join #data_migration_actions ac on ac.ActionId = a.ActionId
			 
		select ef.*
		into #data_migration_files
		from EventFiles ef
			 join #data_migration_events e on e.EventId = ef.EventId
		
		
		truncate table SafetyEvents
		truncate table PeopleInvolved
		truncate table Actions
		truncate table Approvals
		truncate table EventFiles

		--RE-insert data 
		set identity_insert SafetyEvents on 
		insert into SafetyEvents(EventId, EventType,EventStatus,ReportedBy,ReportedOn,EventDate,EmployeeId,JobTitle,Shift,WhatHappened,IsInjury,IsIllness,HoursWorkedPrior,InitialCategory,ResultingCategory,Division,Site,Area,Department,LocaleRegion,LocaleSite,LocalePlant,LocalePlantArea,WorkEnvironment,NatureOfInjury,BodyPart,FirstAidType,OffPlantMedicalFacility,MaterialInvolved,EquipmentInvolved,LostTime,FirstAid,Transported,ER,PassedPOET,RecordedOnVideo,CameraId,VideoStartRef,VideoEndRef,DepartmentId,LocaleId,CreatedOn,CreatedBy,ModifiedOn,ModifiedBy,LegacyIncidentId)
		select EventId, EventType,EventStatus,ReportedBy,ReportedOn,EventDate,EmployeeId,JobTitle,Shift,WhatHappened,IsInjury,IsIllness,HoursWorkedPrior,InitialCategory,ResultingCategory,Division,Site,Area,Department,LocaleRegion,LocaleSite,LocalePlant,LocalePlantArea,WorkEnvironment,NatureOfInjury,BodyPart,FirstAidType,OffPlantMedicalFacility,MaterialInvolved,EquipmentInvolved,LostTime,FirstAid,Transported,ER,PassedPOET,RecordedOnVideo,CameraId,VideoStartRef,VideoEndRef,DepartmentId,LocaleId,CreatedOn,CreatedBy,ModifiedOn,ModifiedBy,LegacyIncidentId
		from #data_migration_events
		set identity_insert SafetyEvents off
		
		set identity_insert PeopleInvolved on 
		insert into PeopleInvolved(PeopleInvolvedId,RoleId,EventId,EmployeeId,Comments)
		select PeopleInvolvedId,RoleId,EventId,EmployeeId,Comments
		from #data_migration_people
		set identity_insert PeopleInvolved off
		
		set identity_insert Actions on 
		insert into Actions(ActionId,EventId,EventType,AssignedTo,ActionToTake,ActionType,DueDate,CompletionDate,ApprovalDate,CreatedOn,CreatedBy,ModifiedOn,ModifiedBy)
		select ActionId,EventId,EventType,AssignedTo,ActionToTake,ActionType,DueDate,CompletionDate,ApprovalDate,CreatedOn,CreatedBy,ModifiedOn,ModifiedBy
		from #data_migration_actions
		set identity_insert Actions off
		
		set identity_insert Approvals on 
		insert into Approvals(ApprovalId,ActionId,ApprovalLevelId,ApprovedBy,ApprovedOn,Notes)
		select ApprovalId,ActionId,ApprovalLevelId,ApprovedBy,ApprovedOn,Notes
		from #data_migration_approvals
		set identity_insert Approvals off
		
		set identity_insert EventFiles on 
		insert into EventFiles(EventFileId,EventId,UserId,ServerFileName,UserFileName,CreatedOn)
		select EventFileId,EventId,UserId,ServerFileName,UserFileName,CreatedOn
		from #data_migration_files
		set identity_insert EventFiles off
	end
	   
	--incidents
	insert into SafetyEvents 
	select 
		'Safety Incident'
		,case when legi.Completed = 1 then 'Closed' else 'Open' end as EventStatus
		,case when legi.SubmittedBy = 0 then 'N/A' else cast(legi.SubmittedBy as varchar) end as ReportedBy
		,dateadd(hour, @utcoffset, cast(legi.SubmittedDate as datetime2)) as ReportedOn
		,dateadd(hour, @utcoffset, cast(legi.IncidentDate as datetime2)) as EventDate
		,legi.eNumber as EmployeeId
		,legj.JobDescription as JobTitle
		,legi.IncidentShift as Shift
		,legi.Addendum as WhatHappened
		,case when legi.InjuryId = 73 then 0 else 1 end as IsInjury
		,0 as IsIllness
		,legi.HoursWorked as HoursWorkedPrior
		,legc.CategoryDesc as InitialCategory
		,legc.CategoryDesc as ResultingCategory
		,'Ammo' as Divison
		,'Lewiston (CCI/Speer)' as Site
		,newha.HierarchyName as Area
		,newhd.HierarchyName as Department
		,'PNW' as LocaleRegion
		,'Lewiston' as LocaleSite
		,'Main Plant' as LocalePlant
		,'N/A' as LocalePlantArea
		,legwe.WorkEnvironment as WorkEnviornment
		,legnoi.Description as NatureOfInjury
		,legbp.Description as BodyPart
		,legfa.Description as FirstAidType
		,isnull(legopmf.Description, 'None') as OffPlantMedicalFacility
		,legm.Description as MaterialInvolved
		,lege.Description as EquipmentInvolved
		,isnull(legi.LostTime, 0) as LostTime
		,case when legfa.Description is null then 0 else 1 end as FirstAid
		,legi.Transported as Transported
		,0 as ER
		,0 as PassedPoet
		,0 as RecordedOnVideo
		,null as CameraId
		,null as VideoStartRef
		,null as VideoEndRef
		,newhd.HierarchyId as DepartmentId
		,dbo.fnGetHierarchyIdByName('Lewiston') as LocaleId
		,GETUTCDATE() as CreatedOn
		,'sysmigration' as CreatedBy
		,GETUTCDATE() as ModifiedOn
		,'sysmigration' as ModifiedBy
		,legi.IncidentID as LegacyIncidentId
	from Incident.dbo.Incident legi
			join Incident.dbo.PlantJob legj on legj.PlantJobId = legi.JobId
			join Incident.dbo.Category legc on legc.CategoryID = legi.CategoryID 
			join Hierarchies newha on newha.HierarchyId = dbo.fnSiteAreaTOHierarchyIdMapper(legi.IncidentDept) and newha.HierarchyLevelId = 501
			join Hierarchies newhd on newhd.HierarchyId = dbo.fnSiteAreaDeptTOHierarchyIdMapper(legi.IncidentDept) and newhd.HierarchyLevelId = 601
			left join Incident.dbo.WorkEnvironment legwe on legwe.WorkEnviromentID = legi.WorkEnviromentID 
			left join Incident.dbo.AttributeDetail legacc on legacc.AttributeID = legi.AccidentId and legacc.TypeID = 1 --How Injured
			left join Incident.dbo.AttributeDetail legbp on legbp.AttributeID = legi.BodyPartId and legbp.TypeID = 2 --Body Part
			left join Incident.dbo.AttributeDetail legnoi on legnoi.AttributeID = legi.InjuryId and legnoi.TypeID = 3 --Injury Type
			left join Incident.dbo.AttributeDetail legopmf on legopmf.AttributeID = legi.OffPlantId and legopmf.TypeID = 5 --Off Plant Medical Facility
			left join Incident.dbo.AttributeDetail legfa on legfa.AttributeID = legi.FirstAidId and legfa.TypeID = 8 --First Aid
			left join Incident.dbo.Material legm on legm.MaterialId = legi.MaterialId 
			left join Incident.dbo.Equipment lege on lege.EquipmentId = legi.EquipmentId 
			--left join Incident.dbo.vCauses legroot on legroot.IncidentID = legi.IncidentID and legroot.CauseType = 'Root Cause'
			--left join Incident.dbo.vCauses legcf on legcf.IncidentID = legi.IncidentID and legcf.CauseType = 'Contributing Factor'
			--left join Incident.dbo.vCauses legic on legic.IncidentID = legi.IncidentID and legic.CauseType = 'Immediate Cause'
	where dbo.fnSiteAreaDeptTOHierarchyIdMapper(legi.IncidentDept) != -1

	--people involved 
	insert into PeopleInvolved 
	select 
		case when legrt.RoleDesc = 'InvestigationTeam' then 179
			 when legrt.RoleDesc = 'Supervisor' then 180
			 when legrt.RoleDesc = 'Witness' then 181
			 when legrt.RoleDesc = 'Other' then 182
			 else -1 end as RoleId
		,se.EventId
		,legip.eNumber
		,legip.Comments
	from Incident.dbo.IncidentPerson legip
		join Incident.dbo.RoleType legrt on legrt.RoleID = legip.RoleID
		join SafetyEvents se on se.LegacyIncidentId = legip.IncidentID

	--actions 
	declare @eventId int, @assignedTo nvarchar(50), @actionToTake nvarchar(max), @actionType nvarchar(50), @dueDate datetime, @completionDate datetime, @approvalDate datetime, @deptApr bit, @deptAprOn datetime, @areaApr bit, @areaAprOn datetime, @safetyApr bit, @safetyAprOn datetime
	declare @newId int
	declare action_cursor CURSOR FOR 

		select 
			se.EventId
			,legad.Enumber as AssignedTo
			,legad.Action as ActionToTake
			,legat.ActionTypeDesc as ActionType
			,dateadd(hour, @utcoffset, cast(legad.ActionDate as datetime2)) as DueDate
			,dateadd(hour, @utcoffset, cast(legad.CompletionDate as datetime2)) as CompletionDate
			,case when legad.Safety_ApprovalDate is not null then dateadd(hour, @utcoffset, legad.Safety_ApprovalDate)
				  when legad.Area_ApprovalDate is not null then dateadd(hour, @utcoffset, legad.Area_ApprovalDate)
				  when legad.Dept_ApprovalDate is not null then dateadd(hour, @utcoffset, legad.Dept_ApprovalDate)
				  else null end as ApprovalDate
			,isnull(legad.Dept_Approval, 0) 
			,dateadd(hour, @utcoffset, legad.Dept_ApprovalDate) 
			,isnull(legad.Area_Approval, 0)
			,dateadd(hour, @utcoffset, legad.Area_ApprovalDate)
			,isnull(legad.Safety_Approval, 0)
			,dateadd(hour, @utcoffset, legad.Safety_ApprovalDate)
		from Incident.dbo.ActionDetails legad
			 join Incident.dbo.ActionType legat on legat.ActionTypeID = legad.ActionTypeID
			 join SafetyEvents se on se.LegacyIncidentId = legad.IncidentID

	open action_cursor
	fetch next from action_cursor into @eventId, @assignedTo, @actionToTake, @actionType, @dueDate, @completionDate, @approvalDate, @deptApr, @deptAprOn, @areaApr, @areaAprOn, @safetyApr, @safetyAprOn

	while @@FETCH_STATUS = 0 
	begin 
		insert into Actions
		select 
			@eventId
			,'Safety Incident'
			,@assignedTo
			,@actionToTake
			,@actionType
			,@dueDate
			,@completionDate
			,@approvalDate
			,GETUTCDATE()
			,'system'
			,GETUTCDATE()
			,'system'
		
		set @newId = (select max(ActionId) from Actions)
		
		--insert approval record for dept
		if (@deptApr = 1)
		begin 
			insert into Approvals
			select 
				@newId --ActionId
				,1	--Level
				,'N/A' --ApprovedBy
				,isnull(@deptAprOn, cast(getutcdate() as date))
				,'Legacy Apprroval Migration' --Notes
		end
		
		--insert approval record for area
		if (@areaApr = 1)
		begin
			insert into Approvals
			select 
				@newId
				,2
				,'N/A'
				,isnull(@areaAprOn, cast(getutcdate() as date))
				,'Legacy Apprroval Migration'
		end
		
		--insert approal  record for safety 
		if (@safetyApr = 1)
		begin
			insert into Approvals
			select 
				@newId
				,5
				,'N/A'
				,isnull(@safetyAprOn, cast(getutcdate() as date))
				,'Legacy Apprroval Migration'
		end	

		fetch next from action_cursor into @eventId, @assignedTo, @actionToTake, @actionType, @dueDate, @completionDate, @approvalDate, @deptApr, @deptAprOn, @areaApr, @areaAprOn, @safetyApr, @safetyAprOn
	end 
	close action_cursor
	deallocate action_cursor 

	--causes 
	--root causes
	insert into EventCauses 
	select se.EventId, ha.HierarchyAttributeId, legic.Comments
	from Incident.dbo.IncidentCause legic 
		 join Incident.dbo.AttributeDetail legad on legic.CauseId = legad.AttributeID
		 join SafetyEvents se on se.LegacyIncidentId = legic.IncidentId 
		 join HierarchyAttributes ha on ha.Value = legad.Description
	where legad.TypeID = 7	--Root Cause 
		 and ha.[Key] = 'Root Causes'

	--Contributing Factors
	insert into EventCauses 
	select se.EventId, ha.HierarchyAttributeId, legic.Comments
	from Incident.dbo.IncidentCause legic 
		 join Incident.dbo.AttributeDetail legad on legic.CauseId = legad.AttributeID
		 join SafetyEvents se on se.LegacyIncidentId = legic.IncidentId 
		 join HierarchyAttributes ha on ha.Value = legad.Description
	where legad.TypeID = 11	--Contributing Factors
		 and ha.[Key] = 'Contributing Factors'
		 
	--Immediate Causes
	insert into EventCauses 
	select se.EventId, ha.HierarchyAttributeId, legic.Comments
	from Incident.dbo.IncidentCause legic 
		 join Incident.dbo.AttributeDetail legad on legic.CauseId = legad.AttributeID
		 join SafetyEvents se on se.LegacyIncidentId = legic.IncidentId 
		 join HierarchyAttributes ha on ha.Value = legad.Description
	where legad.TypeID = 12	--Immediate Cause
		 and ha.[Key] = 'Immediate Causes'

	--files - this will only be a refrence to the file name, we're not actually migrating files over for legacy incidents 
	insert into EventFiles (EventId, UserId, ServerFileName, UserFileName, CreatedOn)
	select se.EventId, 'sysmigration', legid.Filepath, legid.DocName, getutcdate()
	from Incident.dbo.IncidentDocs legid
		 join SafetyEvents se on se.LegacyIncidentId = legid.IncidentID



END
GO
/****** Object:  StoredProcedure [dbo].[spPeopleInvolvedMerge]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 8/2/2019
-- Description:	Add or Update operations for the  PeopleInvolved table
-- select * from dbo.PeopleInvolved
-- =============================================
CREATE PROCEDURE [dbo].[spPeopleInvolvedMerge]
	@PeopleInvolvedTable dbo.PeopleInvolvedTableType READONLY, 
	@UserId nvarchar(50) 
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId

	
	merge dbo.PeopleInvolved with (updlock, rowlock) t 
	using 
		(
			select RoleId, EventId, EmployeeId, Comments
			from @PeopleInvolvedTable
		) s
		on t.RoleId = s.RoleId and t.EventId = s.EventId and t.EmployeeId = s.EmployeeId
	when matched then 
		update 
		set Comments = s.Comments
	--when not matched and t.RoleId is not null then 
	--	delete
	when not matched and s.RoleId is not null then 
		insert (RoleId, EventId, EmployeeId, Comments) 
		values (s.RoleId, s.EventId, s.EmployeeId, s.Comments); 
		

	--delete records that didnt come in with the table param (cant use the merge statement for this) 
	declare @EventId int = (select top(1) EventId from @PeopleInvolvedTable)
	delete p
	from PeopleInvolved p
		 left join @PeopleInvolvedTable e on e.RoleId = p.RoleId and e.EventId = p.EventId and e.EmployeeId = p.EmployeeId 
	where p.EventId = @EventId
		and e.RoleId is null 

END
GO
/****** Object:  StoredProcedure [dbo].[spSafetyEventAddOrUpdate]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Add or Update operations for the SafetyEvents Table
-- Select * from dbo.SafetyEvents
-- =============================================
CREATE PROCEDURE [dbo].[spSafetyEventAddOrUpdate] 
	@EventId	int = null,
	@EventType	nvarchar(50),
	@EventStatus	nvarchar(50),
	@ReportedBy	nvarchar(50),
	@ReportedOn	datetime2,
	@EventDate	datetime,
	--@EventTime	time(7),
	@EmployeeId	nvarchar(50),
	@JobTitle	nvarchar(50),
	@Shift	nvarchar(50),
	@WhatHappened	nvarchar(max),
	@IsInjury	bit,
	@IsIllness	bit,
	@HoursWorkedPrior	decimal(3,1),
	@InitialCategory	nvarchar(50),
	@ResultingCategory	nvarchar(50),
	@WorkEnvironment	nvarchar(50),
	@NatureOfInjury	nvarchar(50),
	@BodyPart	nvarchar(50),
	@FirstAidType	nvarchar(50),
	@OffPlantMedicalFacility	nvarchar(50),
	@MaterialInvolved	nvarchar(50),
	@EquipmentInvolved	nvarchar(50),
	@LostTime	bit,
	@FirstAid	bit,
	@Transported	bit,
	@ER	bit,
	@RecordedOnVideo	bit,
	@CameraId	int,
	@VideoStartRef	datetime2,
	@VideoEndRef	datetime2,
	@DepartmentId	int,
	@LocaleId	int,
	@UserId nvarchar(50),
	@NewEventId int output 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId

	declare
		@Division nvarchar(50)			= (select h.HierarchyName from dbo.fnGetHierarchySinglePath(@DepartmentId) h join HierarchyLevels l on h.HierarchyLevelId = l.HierarchyLevelId where l.HierarchyLevel = 2),
		@Site nvarchar(50)				= (select h.HierarchyName from dbo.fnGetHierarchySinglePath(@DepartmentId) h join HierarchyLevels l on h.HierarchyLevelId = l.HierarchyLevelId where l.HierarchyLevel = 3),
		@Area nvarchar(50)				= (select h.HierarchyName from dbo.fnGetHierarchySinglePath(@DepartmentId) h join HierarchyLevels l on h.HierarchyLevelId = l.HierarchyLevelId where l.HierarchyLevel = 4),
		@Department	nvarchar(50)		= (select h.HierarchyName from dbo.fnGetHierarchySinglePath(@DepartmentId) h join HierarchyLevels l on h.HierarchyLevelId = l.HierarchyLevelId where l.HierarchyLevel = 5),
		@LocaleRegion nvarchar(50)		= (select h.HierarchyName from dbo.fnGetHierarchySinglePath(@LocaleId) h join HierarchyLevels l on h.HierarchyLevelId = l.HierarchyLevelId where l.HierarchyLevel = 2),
		@LocaleSite	nvarchar(50)		= (select h.HierarchyName from dbo.fnGetHierarchySinglePath(@LocaleId) h join HierarchyLevels l on h.HierarchyLevelId = l.HierarchyLevelId where l.HierarchyLevel = 3),
		@LocalePlant nvarchar(50)		= (select h.HierarchyName from dbo.fnGetHierarchySinglePath(@LocaleId) h join HierarchyLevels l on h.HierarchyLevelId = l.HierarchyLevelId where l.HierarchyLevel = 4),
		@LocalePlantArea nvarchar(50)	= (select h.HierarchyName from dbo.fnGetHierarchySinglePath(@LocaleId) h join HierarchyLevels l on h.HierarchyLevelId = l.HierarchyLevelId where l.HierarchyLevel = 5)

    if(@EventId is null) 
	begin 
		print 'Insert new safety event'
		insert into [dbo].[SafetyEvents]
           ([EventType]
           ,[EventStatus]
           ,[ReportedBy]
           ,[ReportedOn]
           ,[EventDate]
           --,[EventTime]
           ,[EmployeeId]
           ,[JobTitle]
           ,[Shift]
           ,[WhatHappened]
           ,[IsInjury]
           ,[IsIllness]
           ,[HoursWorkedPrior]
           ,[InitialCategory]
           ,[ResultingCategory]
           ,[Division]
           ,[Site]
           ,[Area]
           ,[Department]
           ,[LocaleRegion]
           ,[LocaleSite]
           ,[LocalePlant]
           ,[LocalePlantArea]
           ,[WorkEnvironment]
           ,[NatureOfInjury]
           ,[BodyPart]
           ,[FirstAidType]
           ,[OffPlantMedicalFacility]
           ,[MaterialInvolved]
           ,[EquipmentInvolved]
           ,[LostTime]
           ,[FirstAid]
           ,[Transported]
           ,[ER]
           ,[RecordedOnVideo]
           ,[CameraId]
           ,[VideoStartRef]
           ,[VideoEndRef]
           ,[DepartmentId]
           ,[LocaleId]
           ,[CreatedOn]
           ,[CreatedBy]
           ,[ModifiedOn]
           ,[ModifiedBy])
     values
           (@EventType,
			@EventStatus,
			@ReportedBy,
			@ReportedOn,
			@EventDate,
			--@EventTime,
			@EmployeeId,
			@JobTitle,
			@Shift,
			@WhatHappened,
			@IsInjury,
			@IsIllness,
			@HoursWorkedPrior,
			@InitialCategory,
			@ResultingCategory,
			@Division,
			@Site,
			@Area,
			@Department,
			@LocaleRegion,
			@LocaleSite,
			@LocalePlant,
			@LocalePlantArea,
			@WorkEnvironment,
			@NatureOfInjury,
			@BodyPart,
			@FirstAidType,
			@OffPlantMedicalFacility,
			@MaterialInvolved,
			@EquipmentInvolved,
			@LostTime,
			@FirstAid,
			@Transported,
			@ER,
			@RecordedOnVideo,
			@CameraId,
			@VideoStartRef,
			@VideoEndRef,
			@DepartmentId,
			@LocaleId,
            GETUTCDATE(),
            @UserId,
            GETUTCDATE(),
            @UserId)

			set @NewEventId = SCOPE_IDENTITY()
			return @NewEventId
	end
	else 
	begin 
		print 'Update existing safety event'
		update SafetyEvents 
		set EventType = @EventType,
			EventStatus = @EventStatus,
			ReportedBy = @ReportedBy,
			ReportedOn = @ReportedOn,
			EventDate = @EventDate,
			--EventTime = @EventTime,
			EmployeeId = @EmployeeId,
			JobTitle = @JobTitle,
			Shift = @Shift,
			WhatHappened = @WhatHappened,
			IsInjury = @IsInjury,
			IsIllness = @IsIllness,
			HoursWorkedPrior = @HoursWorkedPrior,
			InitialCategory = @InitialCategory,
			ResultingCategory = @ResultingCategory,
			Division = @Division,
			Site = @Site,
			Area = @Area,
			Department = @Department,
			LocaleRegion = @LocaleRegion,
			LocaleSite = @LocaleSite,
			LocalePlant = @LocalePlant,
			LocalePlantArea = @LocalePlantArea,
			WorkEnvironment = @WorkEnvironment,
			NatureOfInjury = @NatureOfInjury,
			BodyPart = @BodyPart,
			FirstAidType = @FirstAidType,
			OffPlantMedicalFacility = @OffPlantMedicalFacility,
			MaterialInvolved = @MaterialInvolved,
			EquipmentInvolved = @EquipmentInvolved,
			LostTime = @LostTime,
			FirstAid = @FirstAid,
			Transported = @Transported,
			ER = @ER,
			RecordedOnVideo = @RecordedOnVideo,
			CameraId = @CameraId,
			VideoStartRef = @VideoStartRef,
			VideoEndRef = @VideoEndRef,
			DepartmentId = @DepartmentId,
			LocaleId = @LocaleId,
			ModifiedOn = GETUTCDATE(),
			ModifiedBy = @UserId
		where EventId = @EventId
	end
END
GO
/****** Object:  StoredProcedure [dbo].[spSafetyEventDelete]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		CC
-- Create date: 07/05/2019
-- Description:	Delete operation for the SafetyEvents Table
-- =============================================
CREATE PROCEDURE [dbo].[spSafetyEventDelete]
	@SafetyEventId	int,
	@UserId nvarchar(50) 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId
	
	BEGIN TRY
		BEGIN TRANSACTION 
			--delete approvals
			delete ap
			from dbo.Approvals ap
					join dbo.Actions a on a.ActionId = ap.ActionId 
			where a.EventId = @SafetyEventId

			--delete actions 
			delete dbo.Actions where EventId = @SafetyEventId

			--delete causes
			delete dbo.EventCauses where EventId = @SafetyEventId

			--delete files 
			delete dbo.EventFiles where EventId = @SafetyEventId

			--delete PeopleInvolved
			delete dbo.PeopleInvolved where EventId = @SafetyEventId

			--finally, delete event 
			delete dbo.SafetyEvents where EventId = @SafetyEventId

		--commit the transaction 
		COMMIT
		return 1
	END TRY
	BEGIN CATCH		
		IF @@TRANCOUNT > 0
			ROLLBACK
			return 0
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spSeedDraftsForTesting]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Add or Update operations for the SafetyEvents Table
-- Select * from dbo.SafetyEvents
-- =============================================
CREATE PROCEDURE [dbo].[spSeedDraftsForTesting] 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext 'sys'

	
		insert into [dbo].[SafetyEvents]
           ([EventType]
           ,[EventStatus]
           ,[ReportedBy]
           ,[ReportedOn]
           ,[EventDate]
           --,[EventTime]
           ,[EmployeeId]
           ,[JobTitle]
           ,[Shift]
           ,[WhatHappened]
           ,[IsInjury]
           ,[IsIllness]
           ,[HoursWorkedPrior]
           ,[InitialCategory]
           ,[ResultingCategory]
           ,[Division]
           ,[Site]
           ,[Area]
           ,[Department]
           ,[LocaleRegion]
           ,[LocaleSite]
           ,[LocalePlant]
           ,[LocalePlantArea]
           ,[WorkEnvironment]
           ,[NatureOfInjury]
           ,[BodyPart]
           ,[FirstAidType]
           ,[OffPlantMedicalFacility]
           ,[MaterialInvolved]
           ,[EquipmentInvolved]
           ,[LostTime]
           ,[FirstAid]
           ,[Transported]
           ,[ER]
           ,[RecordedOnVideo]
           ,[CameraId]
           ,[VideoStartRef]
           ,[VideoEndRef]
           ,[DepartmentId]
           ,[LocaleId]
           ,[CreatedOn]
           ,[CreatedBy]
           ,[ModifiedOn]
           ,[ModifiedBy])
     select [EventType]
           ,'Draft'
           ,[ReportedBy]
           ,[ReportedOn]
           ,[EventDate]
           --,[EventTime]
           ,[EmployeeId]
           ,[JobTitle]
           ,[Shift]
           ,[WhatHappened]
           ,[IsInjury]
           ,[IsIllness]
           ,[HoursWorkedPrior]
           ,[InitialCategory]
           ,[ResultingCategory]
           ,[Division]
           ,[Site]
           ,[Area]
           ,[Department]
           ,[LocaleRegion]
           ,[LocaleSite]
           ,[LocalePlant]
           ,[LocalePlantArea]
           ,[WorkEnvironment]
           ,[NatureOfInjury]
           ,[BodyPart]
           ,[FirstAidType]
           ,[OffPlantMedicalFacility]
           ,[MaterialInvolved]
           ,[EquipmentInvolved]
           ,[LostTime]
           ,[FirstAid]
           ,[Transported]
           ,[ER]
           ,[RecordedOnVideo]
           ,[CameraId]
           ,[VideoStartRef]
           ,[VideoEndRef]
           ,[DepartmentId]
           ,[LocaleId]
           ,[CreatedOn]
           ,[CreatedBy]
           ,[ModifiedOn]
           ,[ModifiedBy]
		from SafetyEvents  e
		where len(e.WhatHappened) > 1500
END
GO
/****** Object:  StoredProcedure [dbo].[spSetUserContext]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CC
-- Create date: 10/9/2019
-- Description:	Sets CONTEXT_INFO to user so it can be accessed by our Audit triggers 
-- =============================================
CREATE PROCEDURE [dbo].[spSetUserContext]
	@userId nvarchar(50)
AS
BEGIN

	SET NOCOUNT ON;

	declare @context varbinary(128)
	set @context = convert(varbinary(128), @userId)

	set CONTEXT_INFO @context

END
GO
/****** Object:  StoredProcedure [dbo].[spUserAddOrUpdate]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 07/02/2019
-- Description:	Add or Update operations for the User Table
-- select * from users
-- =============================================
CREATE PROCEDURE [dbo].[spUserAddOrUpdate] 
		@UserId nvarchar(50), 
		@Email nvarchar(255), 
		@FirstName nvarchar(100), 
		@LastName nvarchar(100), 
		@LogicalHierarchyId int, 
		@PhysicalHierarchyId int,
		@Phone nvarchar(20), 
		@RoleId int,
		@TimeZone nvarchar(50), 
		@DateFormat nvarchar(50), 
		@Enabled bit, 
		@ModifiedBy nvarchar(50) --The person who is creating or updating this user 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @ModifiedBy

    if not exists(select UserId from Users where UserId = @UserId)
	begin 
		--set Identity_Insert dbo.Users on 
		insert into dbo.Users (UserId, Email, FirstName, LastName, LogicalHierarchyId, PhysicalHierarchyId, Phone, RoleId, TimeZone, Enabled, DateFormat, CreatedBy, CreatedOn, ModifiedBy, ModifiedOn) 
		values (@UserId, @Email, @FirstName, @LastName, @LogicalHierarchyId, @PhysicalHierarchyId, @Phone, @RoleId, @TimeZone, @Enabled, @DateFormat, @ModifiedBy, getutcdate(), @ModifiedBy, getutcdate())
	end
	else 
	begin 
		update dbo.Users
		set Email = @Email, 
			FirstName = @FirstName, 
			LastName = @LastName, 
			LogicalHierarchyId = @LogicalHierarchyId, 
			PhysicalHierarchyId = @PhysicalHierarchyId,
			Phone = @Phone,
			RoleId = @RoleId, 
			TimeZone = @TimeZone, 
			DateFormat = @DateFormat, 
			Enabled = @Enabled,
			ModifiedBy = @ModifiedBy, 
			ModifiedOn = getutcdate()
		where UserId = @UserId
	end
END
GO
/****** Object:  StoredProcedure [dbo].[spUserDelete]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Delete operation for the Users Table
-- =============================================
CREATE PROCEDURE [dbo].[spUserDelete]
	@UserId nvarchar(50),
	@ModifiedBy nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @ModifiedBy
	
	update Users 
	set Enabled = 0, 
		ModifiedOn = GETUTCDATE(), 
		@ModifiedBy = @ModifiedBy
	where UserId = @UserId 
END
GO
/****** Object:  StoredProcedure [dbo].[spUserReactivate]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Delete operation for the Users Table
-- =============================================
CREATE PROCEDURE [dbo].[spUserReactivate]
	@UserId nvarchar(50),
	@ModifiedBy nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
		
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @ModifiedBy

	update Users 
	set Enabled = 1, 
		ModifiedOn = GETUTCDATE(), 
		@ModifiedBy = @ModifiedBy
	where UserId = @UserId 
END
GO
/****** Object:  StoredProcedure [dbo].[zspEventCauseDelete]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CC
-- Create date: 8/2/2019
-- Description:	Delete operations for the EventCauses table
-- select * from dbo.EventCauses
-- =============================================
CREATE PROCEDURE [dbo].[zspEventCauseDelete]
	@EventCauseId int
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
    delete from EventCauses where EventCauseId = @EventCauseId 

END
GO
/****** Object:  StoredProcedure [dbo].[zspPeopleInvolvedDelete]    Script Date: 11/7/2019 7:09:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CC
-- Create date: 8/2/2019
-- Description:	Delete operations for the PeopleInvolved table
-- select * from dbo.PeopleInvolved
-- =============================================
CREATE PROCEDURE [dbo].[zspPeopleInvolvedDelete]
	@PeopleInvolvedId int
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
    delete from PeopleInvolved where PeopleInvolvedId = @PeopleInvolvedId 

END
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'will be the HierarchyAttributeId from the Root Cause, Immediate Cause or Contributing Factor keys ' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'EventCauses', @level2type=N'COLUMN',@level2name=N'CauseId'
GO
USE [master]
GO
ALTER DATABASE [EHS_Dev] SET  READ_WRITE 
GO
