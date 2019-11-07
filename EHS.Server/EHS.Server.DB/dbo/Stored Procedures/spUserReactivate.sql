
-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Delete operation for the Users Table
-- =============================================
CREATE PROCEDURE [dbo].[spUserReactivate]
	@UserId nvarchar(50),
	@ModifiedBy nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
		
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @ModifiedBy

	update Users 
	set Enabled = 1, 
		ModifiedOn = GETUTCDATE(), 
		@ModifiedBy = @ModifiedBy
	where UserId = @UserId 
END