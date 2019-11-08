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
/****** Object:  UserDefinedFunction [dbo].[fnGetHierarchySinglePath]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[fnGetHierarchySinglePath]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
DROP FUNCTION [dbo].[fnGetHierarchySinglePath]
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetHierarchySinglePath]    Script Date: 11/8/2019 10:32:39 AM ******/
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
