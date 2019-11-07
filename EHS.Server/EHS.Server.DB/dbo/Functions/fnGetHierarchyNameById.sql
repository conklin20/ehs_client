-- =============================================
-- Author:		CC
-- Create date: 11/6/2019
-- Description:	Gets a hierarchy name by the HierarchyId
-- =============================================
CREATE FUNCTION dbo.fnGetHierarchyNameById
(
	@HierarchyId int 
)
RETURNS nvarchar(50)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @HierarchyName nvarchar(50)

	-- Add the T-SQL statements to compute the return value here
	select @HierarchyName = HierarchyName 
	from Hierarchies 
	where HierarchyId = @HierarchyId

	-- Return the result of the function
	RETURN @HierarchyName

END