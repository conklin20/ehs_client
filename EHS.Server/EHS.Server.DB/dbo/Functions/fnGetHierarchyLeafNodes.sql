
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