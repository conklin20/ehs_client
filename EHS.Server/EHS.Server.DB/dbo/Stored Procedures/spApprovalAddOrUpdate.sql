


-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Add or Update operations for the Approvals Table
-- Select * from dbo.Approvals
-- =============================================
CREATE PROCEDURE [dbo].[spApprovalAddOrUpdate] 
	@ActionId	int,
	@ApprovedBy	nvarchar(50),
	@ApprovedOn	datetime2,
	@UserId nvarchar(50) 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId

	
	BEGIN TRY
		BEGIN TRANSACTION 
		
			declare @EventId int = (select EventId from Actions a where a.ActionId = @ActionId) 
			declare @Severity int = (select dbo.fnGetEventSeverity(isnull(e.ResultingCategory, e.InitialCategory)) from SafetyEvents e where e.EventId = @EventId)
			declare @UserRoleId int = (select RoleId from Users u where u.UserId = @UserId)
			declare @ApprovalLevelId int = (select ar.ApprovalLevel
									from Users u 
										 join ApprovalRoutings ar on ar.UserRoleId = u.RoleId
									where u.UserId = @UserId and ar.SeverityId = @Severity)
	
			--insert aprroval 
			if not exists (select a.ApprovalId from Approvals a where a.ActionId = @ActionId and a.ApprovalLevelId = @ApprovalLevelId) 
			begin
				INSERT INTO [dbo].[Approvals]
				   ([ActionId]
				   ,[ApprovalLevelId]
				   ,[ApprovedBy]
				   ,[ApprovedOn])
				   --,[Notes])
				 VALUES
					   (@ActionId
					   ,@ApprovalLevelId
					   ,@ApprovedBy
					   ,@ApprovedOn)
			end
						
			--if action has received all necessary approvals, mark overall action as approved 
			declare @ApprovalsNeeded int, @ApprovalsReceived int 

			select @ApprovalsNeeded = count(ar.ApprovalLevel) 
				  ,@ApprovalsReceived = count(ap.ApprovalId)
			from SafetyEvents e 
				 join ApprovalRoutings ar on ar.SeverityId = dbo.fnGetEventSeverity(isnull(e.ResultingCategory, e.InitialCategory)) 
				 left join Approvals ap on ap.ApprovalLevelId = ar.ApprovalLevel and ap.ActionId = @ActionId
			where e.EventId = @EventId 

			--select @ApprovalsNeeded, @ApprovalsReceived
			if (@ApprovalsNeeded = @ApprovalsReceived)
			begin 
				--set action as approved 
				update Actions
				set ApprovalDate = @ApprovedOn
				where ActionId = @ActionId
			end

		--commit the transaction 
		COMMIT
		return 1
	END TRY
	BEGIN CATCH		
		IF @@TRANCOUNT > 0
			ROLLBACK
			return 0
	END CATCH

END