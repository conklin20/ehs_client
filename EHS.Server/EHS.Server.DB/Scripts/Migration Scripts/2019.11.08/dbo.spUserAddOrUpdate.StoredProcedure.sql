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
/****** Object:  StoredProcedure [dbo].[spUserAddOrUpdate]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[spUserAddOrUpdate]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[spUserAddOrUpdate]
GO
/****** Object:  StoredProcedure [dbo].[spUserAddOrUpdate]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 07/02/2019
-- Description:	Add or Update operations for the User Table
-- select * from users
-- =============================================
CREATE PROCEDURE [dbo].[spUserAddOrUpdate] 
		@UserId nvarchar(50), 
		@Email nvarchar(255), 
		@FirstName nvarchar(100), 
		@LastName nvarchar(100), 
		@LogicalHierarchyId int, 
		@PhysicalHierarchyId int,
		@Phone nvarchar(20), 
		@RoleId int,
		@TimeZone nvarchar(50), 
		@DateFormat nvarchar(50), 
		@Enabled bit, 
		@ModifiedBy nvarchar(50) --The person who is creating or updating this user 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @ModifiedBy

    if not exists(select UserId from Users where UserId = @UserId)
	begin 
		--set Identity_Insert dbo.Users on 
		insert into dbo.Users (UserId, Email, FirstName, LastName, LogicalHierarchyId, PhysicalHierarchyId, Phone, RoleId, TimeZone, Enabled, DateFormat, CreatedBy, CreatedOn, ModifiedBy, ModifiedOn) 
		values (@UserId, @Email, @FirstName, @LastName, @LogicalHierarchyId, @PhysicalHierarchyId, @Phone, @RoleId, @TimeZone, @Enabled, @DateFormat, @ModifiedBy, getutcdate(), @ModifiedBy, getutcdate())
	end
	else 
	begin 
		update dbo.Users
		set Email = @Email, 
			FirstName = @FirstName, 
			LastName = @LastName, 
			LogicalHierarchyId = @LogicalHierarchyId, 
			PhysicalHierarchyId = @PhysicalHierarchyId,
			Phone = @Phone,
			RoleId = @RoleId, 
			TimeZone = @TimeZone, 
			DateFormat = @DateFormat, 
			Enabled = @Enabled,
			ModifiedBy = @ModifiedBy, 
			ModifiedOn = getutcdate()
		where UserId = @UserId
	end
END
GO
