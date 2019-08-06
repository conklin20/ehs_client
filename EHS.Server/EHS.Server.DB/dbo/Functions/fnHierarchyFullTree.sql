-- =============================================
-- Author:		CC
-- Create date: 08/05/2019
-- Description:	selects the full tree of items within the hierarchy from the root HierarchyId provided 
--	Optionaly, you can provide a MinLevel that will return only level = or higher than the value provided 
-- =============================================
CREATE FUNCTION dbo.fnHierarchyFullTree
(	
	@HierarhcyId int, 
	@MinLevel int = 0 
)
RETURNS TABLE 
AS
RETURN 
(
	select h.HierarchyId, h.HierarchyName
	from Hierarchies h
		 join Hierarchies hp on h.Lft between hp.Lft and hp.Rgt and hp.[HierarchyId] = @HierarhcyId
		 join HierarchyLevels l on l.HierarchyLevelId = h.HierarchyLevelId
	where l.HierarchyLevel >= @MinLevel 
)