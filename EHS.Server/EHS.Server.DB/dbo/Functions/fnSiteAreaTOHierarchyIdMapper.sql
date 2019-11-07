-- =============================================
-- Author:		CC
-- Create date: 07/27/2019
-- Description:	maps legacy siteareaId to new hierarchyId
-- select * from dbo.fnGetHierarchyFullTree(4001)
-- =============================================
CREATE FUNCTION [dbo].[fnSiteAreaTOHierarchyIdMapper]
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
			when @SiteAreaId in (61,62,64,66,67,68,69,80,81,83,151,160,174,175,177,178,179,180,181,182,185,186,187,369,370,371,70,184) then 6046 --Support (Mfg)
			when @SiteAreaId in (72,73,131,172,173,176,205,206,207,208,209,296,297,298,299,315,316,317,372,419,420,421,581) then 6090 --Support (Other)
			else -1 end
	)

	-- Return the result of the function
	return @HierarchyId

END