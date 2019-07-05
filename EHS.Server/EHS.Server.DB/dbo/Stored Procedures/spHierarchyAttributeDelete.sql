
-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Delete operation for the HierachyAttribute Table
-- =============================================
CREATE PROCEDURE [dbo].[spHierarchyAttributeDelete]
	@HierarchyAttributeId int,	
	@UserId nvarchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
    print 'Delete hierarchyAttribute' 
	select @HierarchyAttributeId
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