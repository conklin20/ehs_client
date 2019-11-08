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
/****** Object:  UserDefinedFunction [dbo].[fnGetHierarchyFullTree]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[fnGetHierarchyFullTree]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
DROP FUNCTION [dbo].[fnGetHierarchyFullTree]
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetHierarchyFullTree]    Script Date: 11/8/2019 10:32:39 AM ******/
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
