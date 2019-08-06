-- =============================================
-- Author:		CC
-- Create date: 8/2/2019
-- Description:	Delete operations for the EventCauses table
-- select * from dbo.EventCauses
-- =============================================
CREATE PROCEDURE dbo.spEventCauseDelete
	@EventCauseId int
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
    delete from EventCauses where EventCauseId = @EventCauseId 

END