-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Add or Update operations for the Hierachy Table
-- =============================================
CREATE PROCEDURE [dbo].[spHierarchyAddOrUpdate] 
	@HierarchyId int = null, 
	@HierarchyName nvarchar(50), 
	@Lft int, 
	@Rgt int, 
	@HierarchyLevelId int, 
	@UserId nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    if(@HierarchyId is null) 
	begin 
		print 'Insert new hierarchy'
		select max(HierarchyId)+1 from Hierarchies
	end
	else 
	begin 
		print 'Update existing hierarchy'
		select @HierarchyId
	end
END