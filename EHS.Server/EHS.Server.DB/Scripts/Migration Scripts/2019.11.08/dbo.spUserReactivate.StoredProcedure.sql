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
/****** Object:  StoredProcedure [dbo].[spUserReactivate]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[spUserReactivate]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[spUserReactivate]
GO
/****** Object:  StoredProcedure [dbo].[spUserReactivate]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Delete operation for the Users Table
-- =============================================
CREATE PROCEDURE [dbo].[spUserReactivate]
	@UserId nvarchar(50),
	@ModifiedBy nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
		
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @ModifiedBy

	update Users 
	set Enabled = 1, 
		ModifiedOn = GETUTCDATE(), 
		@ModifiedBy = @ModifiedBy
	where UserId = @UserId 
END
GO
