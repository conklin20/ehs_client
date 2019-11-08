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
/****** Object:  UserDefinedFunction [dbo].[fnGetHierarchyLeafNodes]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[fnGetHierarchyLeafNodes]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
DROP FUNCTION [dbo].[fnGetHierarchyLeafNodes]
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetHierarchyLeafNodes]    Script Date: 11/8/2019 10:32:39 AM ******/
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
