
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
	
    print 'Delete action' 
	delete from Actions where ActionId = @ActionId 
END