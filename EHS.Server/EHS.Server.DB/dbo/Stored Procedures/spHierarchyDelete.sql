-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Delete operation for the Hierachy Table
-- =============================================
CREATE PROCEDURE [dbo].[spHierarchyDelete]
	--@HierarchyToDelete dbo.HierarchyTableType READONLY, 
	@HierarchyId int, 
	@UserId nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId
	
	declare @myLeft int, @myRight int, @myWidth int 
	select @myLeft = Lft, @myRight = Rgt, @myWidth = Rgt - Lft + 1
	from Hierarchies h 
	where h.HierarchyId = @HierarchyId
	--select @myLeft, @myRight, @myWidth

	--Not actually going to delete, just remove these from any hierarchy 
	update Hierarchies 
	set Lft = -1, 
		Rgt = -1
	where Lft between @myLeft and @myRight 
	--DELETE 
	--FROM Hierarchies
	--WHERE Lft BETWEEN @myLeft AND @myRight;

	--update the remaining affected hierarchies 
	update Hierarchies set rgt = rgt - @myWidth where rgt > @myRight;
	update Hierarchies set lft = lft - @myWidth where lft > @myRight;
END