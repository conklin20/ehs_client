

-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Delete operation for the Approvals Table
-- =============================================
CREATE PROCEDURE [dbo].[spApprovalDelete]
	@ApprovalId	int,
	@UserId nvarchar(50) 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
    print 'Delete approval' 
	delete from Approvals where ApprovalId = @ApprovalId 
END