-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Add or Update operations for the Hierachy Table
-- =============================================
CREATE PROCEDURE [dbo].[spHierarchyAddOrUpdate] 
	@Hierarchy dbo.HierarchyTableType READONLY, 
	@LeftHierarchy dbo.HierarchyTableType READONLY,
	@FirstChild bit = 0, 
	@UserId nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
		
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId

	--Updating name of hierarchy only. 
	if(select HierarchyId from @Hierarchy) is not null
	begin 
		update h
		set h.HierarchyName = h2.HierarchyName, 
			h.ModifiedOn = getutcdate(), 
			h.ModifiedBy = @UserId
		from Hierarchies h 
			 join @Hierarchy h2 on h2.HierarchyId = h.Hierarchyid
		
	end
	else --if(select HierarchyId from @Hierarchy) is null
	begin 
		--new hierarchy 
		if(@FirstChild = 0)
		begin 
			declare @myRight int = (select Rgt from @LeftHierarchy) 

			update Hierarchies 
			set rgt = rgt + 2,
				ModifiedOn = getutcdate(), 
				ModifiedBy = @UserId
			where rgt > @myRight;

			update Hierarchies 
			set lft = lft + 2 ,
				ModifiedOn = getutcdate(), 
				ModifiedBy = @UserId
			where lft > @myRight;

			insert into Hierarchies(HierarchyName, lft, rgt, HierarchyLevelId, CreatedOn, CreatedBy, ModifiedOn, ModifiedBy) 
			select HierarchyName, @myRight + 1, @myRight + 2, HierarchyLevelId, getutcdate(), @UserId, getutcdate(), @UserId from @Hierarchy
		end 
		else 
		begin 
			declare @myLeft int = (select Lft from @LeftHierarchy) 

			update Hierarchies 
			set rgt = rgt + 2,
				ModifiedOn = getutcdate(), 
				ModifiedBy = @UserId
			where rgt > @myLeft;

			update Hierarchies 
			set lft = lft + 2,
				ModifiedOn = getutcdate(), 
				ModifiedBy = @UserId 
			where lft > @myLeft;

			insert into Hierarchies(HierarchyName, lft, rgt, HierarchyLevelId, CreatedOn, CreatedBy, ModifiedOn, ModifiedBy) 
			select HierarchyName, @myLeft + 1, @myLeft + 2, HierarchyLevelId, getutcdate(), @UserId, getutcdate(), @UserId from @Hierarchy
		end

		

	end 
    --select * from @NewHierarchy

END