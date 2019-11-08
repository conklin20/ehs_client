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
/****** Object:  StoredProcedure [dbo].[spSetUserContext]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[spSetUserContext]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[spSetUserContext]
GO
/****** Object:  StoredProcedure [dbo].[spSetUserContext]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CC
-- Create date: 10/9/2019
-- Description:	Sets CONTEXT_INFO to user so it can be accessed by our Audit triggers 
-- =============================================
CREATE PROCEDURE [dbo].[spSetUserContext]
	@userId nvarchar(50)
AS
BEGIN

	SET NOCOUNT ON;

	declare @context varbinary(128)
	set @context = convert(varbinary(128), @userId)

	set CONTEXT_INFO @context

END
GO
