
-- =============================================
-- Author:		CC
-- Create date: 10/23/2019
-- Description:	Add or Update operations for the  EventFiles table
-- select * from dbo.EventFiles
-- =============================================
CREATE PROCEDURE [dbo].[spEventFileAddOrUpdate]
	@EventId int,
	@UserId nvarchar(50), 
	@ServerFileName nvarchar(250), 
	@UserFileName nvarchar(250)
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId
	
	if not exists(select * from EventFiles ef where ef.EventId = @EventId and ef.UserId = @UserId and ef.ServerFileName = @ServerFileName)
	begin 
		insert into dbo.EventFiles 
		select @EventId, @UserId, @ServerFileName, @UserFileName, getutcdate()
	end
	else 
	begin 
		select 'File already exists'
	end

END