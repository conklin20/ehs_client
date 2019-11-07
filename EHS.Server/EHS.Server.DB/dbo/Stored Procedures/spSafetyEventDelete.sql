

-- =============================================
-- Author:		CC
-- Create date: 07/05/2019
-- Description:	Delete operation for the SafetyEvents Table
-- =============================================
CREATE PROCEDURE [dbo].[spSafetyEventDelete]
	@SafetyEventId	int,
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
			--delete approvals
			delete ap
			from dbo.Approvals ap
					join dbo.Actions a on a.ActionId = ap.ActionId 
			where a.EventId = @SafetyEventId

			--delete actions 
			delete dbo.Actions where EventId = @SafetyEventId

			--delete causes
			delete dbo.EventCauses where EventId = @SafetyEventId

			--delete files 
			delete dbo.EventFiles where EventId = @SafetyEventId

			--delete PeopleInvolved
			delete dbo.PeopleInvolved where EventId = @SafetyEventId

			--finally, delete event 
			delete dbo.SafetyEvents where EventId = @SafetyEventId

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