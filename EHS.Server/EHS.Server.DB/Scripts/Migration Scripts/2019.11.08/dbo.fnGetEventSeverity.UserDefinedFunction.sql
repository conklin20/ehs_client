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
/****** Object:  UserDefinedFunction [dbo].[fnGetEventSeverity]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[fnGetEventSeverity]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
DROP FUNCTION [dbo].[fnGetEventSeverity]
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetEventSeverity]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CC
-- Create date: 10/10/2019
-- Description:	Get the severity of an event given the event result 
-- =============================================
CREATE FUNCTION [dbo].[fnGetEventSeverity] 
(
	@Result nvarchar(50) 
)
RETURNS int
AS
BEGIN
	-- Declare the return variable here
	DECLARE @Severity int 

	-- Add the T-SQL statements to compute the return value here
	SELECT @Severity = rs.SeverityId
	from HierarchyAttributes ha
		 join ResultSeverities rs on rs.HierarchyAttributeId = ha.HierarchyAttributeId
	where ha.[Value] = @Result
		 and ha.[Key] in ('Initial Category', 'Resulting Category')
		 and rs.Enabled = 1

	-- Return the result of the function
	RETURN @Severity 

END
GO
