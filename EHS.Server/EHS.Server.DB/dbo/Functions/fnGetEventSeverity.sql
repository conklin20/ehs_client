-- =============================================
-- Author:		CC
-- Create date: 10/10/2019
-- Description:	Get the severity of an event given the event result 
-- =============================================
CREATE FUNCTION dbo.fnGetEventSeverity 
(
	@Result nvarchar(50) 
)
RETURNS int
AS
BEGIN
	-- Declare the return variable here
	DECLARE @Severity int 

	-- Add the T-SQL statements to compute the return value here
	SELECT @Severity = rs.SeverityId
	from HierarchyAttributes ha
		 join ResultSeverities rs on rs.HierarchyAttributeId = ha.HierarchyAttributeId
	where ha.[Value] = @Result
		 and ha.[Key] in ('Initial Category', 'Resulting Category')
		 and rs.Enabled = 1

	-- Return the result of the function
	RETURN @Severity 

END