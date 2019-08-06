-- =============================================
-- Author:		CC
-- Create date: 07/27/2019
-- Description:	maps legacy siteareadeptId to new hierarchyId
-- =============================================
CREATE FUNCTION dbo.fnSiteAreaDeptTOHierarchyIdMapper
(
	-- Add the parameters for the function here
	@SiteAreaDeptId int 
)
RETURNS int
AS
BEGIN
	-- Declare the return variable here
	DECLARE @HierarchyId int 

	-- Add the T-SQL statements to compute the return value here
	set @HierarchyId = (
		select case 
			when @SiteAreaDeptId = 49 then 6006
			when @SiteAreaDeptId = 59 then 6007
			when @SiteAreaDeptId = 60 then 6008
			when @SiteAreaDeptId = 163 then 6009
			when @SiteAreaDeptId = 164 then 6010
			when @SiteAreaDeptId = 53 then 6011
			when @SiteAreaDeptId = 54 then 6012
			when @SiteAreaDeptId = 55 then 6013
			when @SiteAreaDeptId = 56 then 6014
			when @SiteAreaDeptId = 48 then 6015
			when @SiteAreaDeptId = 50 then 6016
			when @SiteAreaDeptId = 51 then 6017
			else -1 end
	)

	-- Return the result of the function
	return @HierarchyId

END