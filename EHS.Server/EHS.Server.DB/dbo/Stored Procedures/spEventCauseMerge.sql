
-- =============================================
-- Author:		CC
-- Create date: 8/2/2019
-- Description:	Add or Update operations for the EventCauses table
-- select * from dbo.EventCauses
-- =============================================
CREATE PROCEDURE [dbo].[spEventCauseMerge]
	@CausesTable dbo.CausesTableType READONLY, 
	@UserId nvarchar(50) 
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId
		
	merge dbo.EventCauses with (updlock, rowlock) t 
	using 
		(
			select EventId, CauseId, Comments
			from @CausesTable
		) s
		on  t.EventId = s.EventId and t.CauseId = s.CauseId
	when matched then 
		update 
		set Comments = s.Comments
	--when not matched and t.RoleId is not null then 
	--	delete
	when not matched and s.CauseId is not null then 
		insert (EventId, CauseId, Comments) 
		values (s.EventId, s.CauseId, s.Comments); 
		

	--delete records that didnt come in with the table param (cant use the merge statement for this) 
	declare @EventId int = (select top(1) EventId from @CausesTable)
	delete c
	from EventCauses c
		 left join @CausesTable c2 on c2.EventId = c.EventId and c2.CauseId = c.CauseId 
	where c.EventId = @EventId
		and c2.CauseId is null 
END