
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