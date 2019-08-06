


-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Add or Update operations for the Approvals Table
-- Select * from dbo.Approvals
-- =============================================
CREATE PROCEDURE [dbo].[spApprovalAddOrUpdate] 
	@ApprovalId	int = null,
	@ActionId	int,
	@ApprovalLevelId	int,
	@ApprovedBy	nvarchar(50),
	@ApprovedOn	datetime2,
	@Notes	nvarchar(255),
	@UserId nvarchar(50) 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    if(@ApprovalId is null) 
	begin 
		print 'Insert new approval'
		INSERT INTO [dbo].[Approvals]
           ([ActionId]
           ,[ApprovalLevelId]
           ,[ApprovedBy]
           ,[ApprovedOn]
           ,[Notes])
		 VALUES
			   (@ActionId
			   ,@ApprovalLevelId
			   ,@ApprovedBy
			   ,@ApprovedOn
			   ,@Notes)
	end
	else 
	begin 
		print 'Update existing approval'
		update Approvals 
		set	ActionId = @ActionId, 
			ApprovalLevelId = @ApprovalLevelId, 
			ApprovedBy = @ApprovedBy, 
			ApprovedOn = @ApprovedOn, 
			Notes = @Notes
		where ApprovalId = @ApprovalId 
	end
END