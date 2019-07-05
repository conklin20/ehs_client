﻿-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Delete operation for the Hierachy Table
-- =============================================
CREATE PROCEDURE [dbo].[spHierarchyDelete]
	@HierarchyId int,	
	@Lft int, 
	@Rgt int, 
	@UserId nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
    print 'Delete hierarchy, adjust existinig hierarchies to account for the delete (new lft and rgt values)' 
	select 1 from Hierarchies
	--INSERT INTO [app].[AppLog]
 --          ([AppId]
 --          ,[Level]
 --          ,[Logger]
 --          ,[UserName]
 --          ,[MachineName]
 --          ,[LoggedOn]
 --          ,[Thread]
 --          ,[Message]
 --          ,[CallSite]
 --          ,[Exception]
 --          ,[StackTrace])
 --    VALUES
 --          (1
 --          ,'Debug'
 --          ,'SQL'
 --          ,'caryc'
 --          ,@@SERVERNAME
 --          ,GETUTCDATE()
 --          ,0
 --          ,'spHierarchyDelete Stored proc was successfully called via Dapper!'
 --          ,''
 --          ,''
 --          ,'')
END