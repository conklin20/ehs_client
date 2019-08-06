-- =============================================
-- Author:		CC
-- Create date: 8/2/2019
-- Description:	Add or Update operations for the EventCauses table
-- select * from dbo.EventCauses
-- =============================================
CREATE PROCEDURE [dbo].[spEventCauseAddOrUpdate]
	@EventCauseId int = null,
	@EventId int, 
	@CauseId int, 
	@Comments nvarchar(2000) 
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
    if(@EventCauseId is null) 
	begin 
		insert into EventCauses 
		select @EventId, @CauseId, @Comments 
	end
	else 
	begin 
		update EventCauses 
		set @CauseId = @CauseId
			,@Comments = @Comments 
		where EventCauseId = @EventCauseId 
	end
END