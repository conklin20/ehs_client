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
/****** Object:  StoredProcedure [dbo].[spHierarchyDelete]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[spHierarchyDelete]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[spHierarchyDelete]
GO
/****** Object:  StoredProcedure [dbo].[spHierarchyDelete]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
GO
