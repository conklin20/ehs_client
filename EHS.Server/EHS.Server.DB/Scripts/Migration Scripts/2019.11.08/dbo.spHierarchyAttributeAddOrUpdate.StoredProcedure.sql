/*    ==Scripting Parameters==

    Source Server Version : SQL Server 2017 (14.0.1000)
    Source Database Engine Edition : Microsoft SQL Server Enterprise Edition
    Source Database Engine Type : Standalone SQL Server

    Target Server Version : SQL Server 2014
    Target Database Engine Edition : Microsoft SQL Server Enterprise Edition
    Target Database Engine Type : Standalone SQL Server
*/
USE [EHS_Dev]
GO
/****** Object:  StoredProcedure [dbo].[spHierarchyAttributeAddOrUpdate]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[spHierarchyAttributeAddOrUpdate]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[spHierarchyAttributeAddOrUpdate]
GO
/****** Object:  StoredProcedure [dbo].[spHierarchyAttributeAddOrUpdate]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

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
GO
