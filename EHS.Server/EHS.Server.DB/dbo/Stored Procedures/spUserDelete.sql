
-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Delete operation for the Users Table
-- =============================================
CREATE PROCEDURE [dbo].[spUserDelete]
	@UserId nvarchar(50),
	@ModifiedBy nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
    print 'Mark user as enabled' 
	
	update Users 
	set Enabled = 0, 
		ModifiedOn = GETUTCDATE(), 
		@ModifiedBy = @ModifiedBy
	where UserId = @UserId 
END