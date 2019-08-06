-- =============================================
-- Author:		CC
-- Create date: 07/27/2019
-- Description:	maps legacy siteareaId to new hierarchyId
-- =============================================
CREATE FUNCTION dbo.fnSiteAreaTOHierarchyIdMapper
(
	-- Add the parameters for the function here
	@SiteAreaId int 
)
RETURNS int
AS
BEGIN
	-- Declare the return variable here
	DECLARE @HierarchyId int 

	-- Add the T-SQL statements to compute the return value here
	set @HierarchyId = (
		select case 
			when @SiteAreaId in (49,59,60,163,164) then 5003 --Centerfire
			when @SiteAreaId in (53,54,55,56) then 5004 --Primers
			when @SiteAreaId in (48,50,51) then 5005 --Rimfire
			else -1 end
	)

	-- Return the result of the function
	return @HierarchyId

END