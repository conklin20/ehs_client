-- =============================================
-- Author:		CC
-- Create date: 10/9/2019
-- Description:	Sets CONTEXT_INFO to user so it can be accessed by our Audit triggers 
-- =============================================
CREATE PROCEDURE dbo.spSetUserContext
	@userId nvarchar(50)
AS
BEGIN

	SET NOCOUNT ON;

	declare @context varbinary(128)
	set @context = convert(varbinary(128), @userId)

	set CONTEXT_INFO @context

END