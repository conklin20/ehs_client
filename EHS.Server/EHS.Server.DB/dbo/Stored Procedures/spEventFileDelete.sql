
-- =============================================
-- Author:		CC
-- Create date: 10/23/2019
-- Description:	Delete operations for the  EventFiles table
-- select * from dbo.EventFiles
-- =============================================
CREATE PROCEDURE [dbo].[spEventFileDelete]
	@EventFileId int,
	@UserId nvarchar(50)
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId
	
	if exists(select * from EventFiles ef where ef.EventFileId = @EventFileId)
	begin 
		delete EventFiles 
		where EventFileId = @EventFileId
	end
	else 
	begin 
		select 'File doesnt exists'
	end

END