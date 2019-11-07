
-- =============================================
-- Author:		CC
-- Create date: 8/2/2019
-- Description:	Add or Update operations for the  PeopleInvolved table
-- select * from dbo.PeopleInvolved
-- =============================================
CREATE PROCEDURE [dbo].[spPeopleInvolvedMerge]
	@PeopleInvolvedTable dbo.PeopleInvolvedTableType READONLY, 
	@UserId nvarchar(50) 
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId

	
	merge dbo.PeopleInvolved with (updlock, rowlock) t 
	using 
		(
			select RoleId, EventId, EmployeeId, Comments
			from @PeopleInvolvedTable
		) s
		on t.RoleId = s.RoleId and t.EventId = s.EventId and t.EmployeeId = s.EmployeeId
	when matched then 
		update 
		set Comments = s.Comments
	--when not matched and t.RoleId is not null then 
	--	delete
	when not matched and s.RoleId is not null then 
		insert (RoleId, EventId, EmployeeId, Comments) 
		values (s.RoleId, s.EventId, s.EmployeeId, s.Comments); 
		

	--delete records that didnt come in with the table param (cant use the merge statement for this) 
	declare @EventId int = (select top(1) EventId from @PeopleInvolvedTable)
	delete p
	from PeopleInvolved p
		 left join @PeopleInvolvedTable e on e.RoleId = p.RoleId and e.EventId = p.EventId and e.EmployeeId = p.EmployeeId 
	where p.EventId = @EventId
		and e.RoleId is null 

END