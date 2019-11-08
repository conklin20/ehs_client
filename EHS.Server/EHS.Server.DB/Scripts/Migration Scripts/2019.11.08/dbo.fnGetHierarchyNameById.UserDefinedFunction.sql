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
/****** Object:  UserDefinedFunction [dbo].[fnGetHierarchyNameById]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[fnGetHierarchyNameById]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
DROP FUNCTION [dbo].[fnGetHierarchyNameById]
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetHierarchyNameById]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CC
-- Create date: 11/6/2019
-- Description:	Gets a hierarchy name by the HierarchyId
-- =============================================
CREATE FUNCTION [dbo].[fnGetHierarchyNameById]
(
	@HierarchyId int 
)
RETURNS nvarchar(50)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @HierarchyName nvarchar(50)

	-- Add the T-SQL statements to compute the return value here
	select @HierarchyName = HierarchyName 
	from Hierarchies 
	where HierarchyId = @HierarchyId

	-- Return the result of the function
	RETURN @HierarchyName

END
GO
