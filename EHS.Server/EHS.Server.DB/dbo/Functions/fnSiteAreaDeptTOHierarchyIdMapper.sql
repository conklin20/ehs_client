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