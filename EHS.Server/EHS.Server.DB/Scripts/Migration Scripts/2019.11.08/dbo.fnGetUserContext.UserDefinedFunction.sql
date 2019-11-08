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
/****** Object:  UserDefinedFunction [dbo].[fnGetUserContext]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[fnGetUserContext]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
DROP FUNCTION [dbo].[fnGetUserContext]
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetUserContext]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CC
-- Create date: 10/9/2019
-- Description:	Read user Context_Info for auditing 
-- =============================================
CREATE FUNCTION [dbo].[fnGetUserContext]()

RETURNS nvarchar(50)
AS
BEGIN
	declare @userId nvarchar(50)

	IF CONTEXT_INFO() IS NOT NULL 
		select @userId = convert(nvarchar(50), CONTEXT_INFO())
	else 
		select @userId = suser_name()

	-- Return the result of the function
	return @userId

END
GO
