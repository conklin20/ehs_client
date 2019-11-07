
-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Delete operation for the Action Table
-- =============================================
CREATE PROCEDURE [dbo].[spActionDelete]
	@ActionId	int,
	@UserId nvarchar(50) 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId

	delete from Actions where ActionId = @ActionId

END