
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
		insert into HierarchyAttributes 
		select @HierarchyId, @AttributeId, @Key, @Value, @Enabled, GETUTCDATE(), @UserId, GETUTCDATE(), @UserId
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