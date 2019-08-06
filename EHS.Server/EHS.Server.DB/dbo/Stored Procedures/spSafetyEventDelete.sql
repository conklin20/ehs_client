

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
	
    print 'Delete @Safety Event' 
	delete from SafetyEvents where EventId = @SafetyEventId
END