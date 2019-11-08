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
/****** Object:  StoredProcedure [dbo].[spActionAddOrUpdate]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[spActionAddOrUpdate]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[spActionAddOrUpdate]
GO
/****** Object:  StoredProcedure [dbo].[spActionAddOrUpdate]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Add or Update operations for the Action Table
-- Select * from dbo.Actions
-- =============================================
CREATE PROCEDURE [dbo].[spActionAddOrUpdate] 
	@ActionId	int = null,
	@EventId	int,
	@EventType	nvarchar(50),
	@AssignedTo	nvarchar(50),
	@ActionToTake	nvarchar(MAX),
	@ActionType	nvarchar(50),
	@DueDate	datetime2,
	@CompletionDate	datetime2 = null,
	@ApprovalDate	datetime2 = null, 
	@UserId nvarchar(50) 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId

    if(@ActionId is null) 
	begin 
		print 'Insert new action'
		INSERT INTO dbo.Actions
           (EventId
           ,EventType
           ,AssignedTo
           ,ActionToTake
           ,ActionType
           ,DueDate
           ,CompletionDate
           ,ApprovalDate
		   ,CreatedOn
           ,CreatedBy
           ,ModifiedOn
           ,ModifiedBy)
		VALUES
           (@EventId
           ,@EventType
           ,@AssignedTo
           ,@ActionToTake
           ,@ActionType
           ,@DueDate
           ,@CompletionDate
           ,@ApprovalDate
		   ,GETUTCDATE()
           ,@UserId
		   ,GETUTCDATE()
           ,@UserId)
	end
	else 
	begin 
		print 'Update existing action'
		update Actions 
		set EventId = @EventId, 
			EventType = @EventType, 
			AssignedTo = @AssignedTo, 
			ActionToTake = @ActionToTake, 
			ActionType = @ActionType, 
			DueDate = @DueDate, 
			CompletionDate = @CompletionDate, 
			ApprovalDate = @ApprovalDate, 
			ModifiedOn = GETUTCDATE(), 
			ModifiedBy = @UserId
		where ActionId = @ActionId 
	end
END
GO
