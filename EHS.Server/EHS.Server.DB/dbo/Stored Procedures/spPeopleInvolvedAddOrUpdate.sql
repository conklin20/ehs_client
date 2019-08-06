-- =============================================
-- Author:		CC
-- Create date: 8/2/2019
-- Description:	Add or Update operations for the  PeopleInvolved table
-- select * from dbo.PeopleInvolved
-- =============================================
CREATE PROCEDURE dbo.spPeopleInvolvedAddOrUpdate
	@PeopleInvolvedId int = null, 
	@RoleId int, 
	@EventId int, 
	@EmployeeId nvarchar(50), 
	@Comments nvarchar(2000) 
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
    if(@PeopleInvolvedId is null) 
	begin 
		insert into PeopleInvolved 
		select @RoleId, @EventId, @EmployeeId, @Comments 
	end
	else 
	begin 
		update PeopleInvolved 
		set RoleId = @RoleId
			,EmployeeId = @EmployeeId 
			,Comments = @Comments 
		where PeopleInvolvedId = @PeopleInvolvedId 
	end
END