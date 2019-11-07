
-- =============================================
-- Author:		CC
-- Create date: 11/6/2019
-- Description:	Gets a hierarchy id by the HierarchyName
-- =============================================
CREATE FUNCTION [dbo].[fnGetHierarchyIdByName]
(
	@HierarchyName nvarchar(50) 
)
RETURNS int
AS
BEGIN
	-- Declare the return variable here
	DECLARE @HierarchyId int

	-- Add the T-SQL statements to compute the return value here
	select @HierarchyId = HierarchyId 
	from Hierarchies 
	where HierarchyName = @HierarchyName

	-- Return the result of the function
	RETURN @HierarchyId

END