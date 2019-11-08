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
/****** Object:  UserDefinedFunction [dbo].[fnSiteAreaDeptTOHierarchyIdMapper]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[fnSiteAreaDeptTOHierarchyIdMapper]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
DROP FUNCTION [dbo].[fnSiteAreaDeptTOHierarchyIdMapper]
GO
/****** Object:  UserDefinedFunction [dbo].[fnSiteAreaDeptTOHierarchyIdMapper]    Script Date: 11/8/2019 10:32:39 AM ******/
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
