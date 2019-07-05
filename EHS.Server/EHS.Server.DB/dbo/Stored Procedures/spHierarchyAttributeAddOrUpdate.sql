
-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Add or Update operations for the HierachyAttribute Table
-- =============================================
CREATE PROCEDURE [dbo].[spHierarchyAttributeAddOrUpdate] 
	@HierarchyAttributeId int = null, 
	@HierarchyId int, 
	@AttributeId int, 
	@Key nvarchar(50), 
	@Value nvarchar(max), 
	@Enabled bit, 
	@UserId nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    if(@HierarchyAttributeId is null) 
	begin 
		print 'Insert new hierarchyAttribute'
		select max(HierarchyAttributeId)+1 from HierarchyAttributes 
	end
	else 
	begin 
		print 'Update existing hierarchyAttribute'
		select @HierarchyAttributeId
	end
END