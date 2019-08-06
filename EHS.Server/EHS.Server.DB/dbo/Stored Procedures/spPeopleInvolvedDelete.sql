-- =============================================
-- Author:		CC
-- Create date: 8/2/2019
-- Description:	Delete operations for the PeopleInvolved table
-- select * from dbo.PeopleInvolved
-- =============================================
CREATE PROCEDURE dbo.spPeopleInvolvedDelete
	@PeopleInvolvedId int
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
    delete from PeopleInvolved where PeopleInvolvedId = @PeopleInvolvedId 

END