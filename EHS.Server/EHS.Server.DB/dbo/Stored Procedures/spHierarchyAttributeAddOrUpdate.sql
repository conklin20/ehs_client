
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
	@UserId nvarchar(50), 
	@NewHierarchyAttributeId int output

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId

    if(@HierarchyAttributeId is null) 
	begin 
		insert into HierarchyAttributes 
		select @HierarchyId, @AttributeId, @Key, @Value, @Enabled, GETUTCDATE(), @UserId, GETUTCDATE(), @UserId
		set @NewHierarchyAttributeId = SCOPE_IDENTITY()
		return @NewHierarchyAttributeId
	end
	else 
	begin 
		update HierarchyAttributes	
		set [HierarchyId] = @HierarchyId
			,AttributeId = @AttributeId
			,[Key] = @Key
			,[Value] = @Value
			,[Enabled] = @Enabled
			,ModifiedOn = GETUTCDATE()
			,ModifiedBy = @UserId
		where HierarchyAttributeId = @HierarchyAttributeId
	end
END