-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Delete operation for the Hierachy Table
-- =============================================
CREATE PROCEDURE dbo.spHierarchyDelete
	@HierarchyId int,	
	@UserId nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    print 'Delete hierarchy, adjust existinig hierarchies to account for the delete (new lft and rgt values)' 
END