-- =============================================
-- Author:		CC
-- Create date: 11/11/2019
-- Description:	Need this function as SQL Server 2012 doesnt have the built-in STRING_AGG function
-- =============================================
CREATE FUNCTION [dbo].[fnGetHierarchyPath]
( 
	@HierarchyId int ,
	@Deliminator nchar(1) = '|'
)
RETURNS nvarchar(255) 
AS
BEGIN
	-- Declare the return variable here
	declare @HierarchyPath nvarchar(255) 

	-- Add the T-SQL statements to compute the return value here
	set @HierarchyPath = (select top 1 STUFF((select @Deliminator + cast(HierarchyId as nvarchar)
											from dbo.fnGetHierarchySinglePath(@HierarchyId) h1
												join HierarchyLevels l on l.HierarchyLevelId = h1.HierarchyLevelId
											--where h1.HierarchyId <= h2.HierarchyId
											order by l.HierarchyLevel 
										for xml path('')), 1, 1, '') as listStr 
							from dbo.fnGetHierarchySinglePath(@HierarchyId) h2 
							group by h2.HierarchyId)
	--select * from dbo.fnGetHierarchySinglePath(4001)

	-- Return the result of the function
	RETURN isnull(@HierarchyPath, 1000)

END