
-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Delete operation for the HierachyAttribute Table
-- =============================================
CREATE PROCEDURE [dbo].[spHierarchyAttributeDelete]
	@HierarchyAttributeId int,	
	@UserId nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId

	update HierarchyAttributes 
	set Enabled = 0 
	where HierarchyAttributeId = @HierarchyAttributeId

END