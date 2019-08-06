
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
		@Phone nvarchar(20), 
		@RoleId int,
		@TimeZone nvarchar(50), 
		@DateFormat nvarchar(50), 
		@CreatedBy nvarchar(50), 
		@ModifiedBy nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    if not exists(select UserId from Users where UserId = @UserId)
	begin 
		print 'Insert new user'
		--INSERT INTO dbo.Users
  --         (UserId
  --         ,Email
  --         ,FullName
  --         ,Phone
  --         ,RoleId
  --         ,TimeZone
  --         ,DateFormat
  --         ,CreatedOn
  --         ,CreatedBy
  --         ,ModifiedOn
  --         ,ModifiedBy)
		-- VALUES
		--	   (@UserId,
		--	   @Email, 
		--	   @FullName, 
		--	   @Phone, 
		--	   @RoleId,
		--	   @TimeZone, 
		--	   @DateFormat, 
		--	   GETUTCDATE(), 
		--	   @CreatedBy, 
		--	   GETUTCDATE(), 
		--	   @ModifiedBy)
	end
	else 
	begin 
		print 'Update existing user'
		--update dbo.Users 
		--set Email = @Email, 
		--	FullName = @FullName, 
		--	Phone = @Phone, 
		--	RoleId = @RoleId, 
		--	TimeZone = @TimeZone, 
		--	DateFormat = @DateFormat, 
		--	ModifiedOn = GETUTCDATE(), 
		--	@ModifiedBy = @ModifiedBy 
		--where UserId = @UserId 
	end
END