
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