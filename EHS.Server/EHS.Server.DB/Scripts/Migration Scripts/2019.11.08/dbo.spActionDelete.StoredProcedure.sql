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
/****** Object:  StoredProcedure [dbo].[spActionDelete]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[spActionDelete]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[spActionDelete]
GO
/****** Object:  StoredProcedure [dbo].[spActionDelete]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Delete operation for the Action Table
-- =============================================
CREATE PROCEDURE [dbo].[spActionDelete]
	@ActionId	int,
	@UserId nvarchar(50) 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId

	delete from Actions where ActionId = @ActionId

END
GO
