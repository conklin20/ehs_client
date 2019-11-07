-- =============================================
-- Author:		CC
-- Create date: 10/9/2019
-- Description:	Read user Context_Info for auditing 
-- =============================================
CREATE FUNCTION dbo.fnGetUserContext()

RETURNS nvarchar(50)
AS
BEGIN
	declare @userId nvarchar(50)

	IF CONTEXT_INFO() IS NOT NULL 
		select @userId = convert(nvarchar(50), CONTEXT_INFO())
	else 
		select @userId = suser_name()

	-- Return the result of the function
	return @userId

END