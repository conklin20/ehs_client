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
/****** Object:  StoredProcedure [dbo].[spSeedDraftsForTesting]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[spSeedDraftsForTesting]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[spSeedDraftsForTesting]
GO
/****** Object:  StoredProcedure [dbo].[spSeedDraftsForTesting]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Add or Update operations for the SafetyEvents Table
-- Select * from dbo.SafetyEvents
-- =============================================
CREATE PROCEDURE [dbo].[spSeedDraftsForTesting] 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext 'sys'

	
		insert into [dbo].[SafetyEvents]
           ([EventType]
           ,[EventStatus]
           ,[ReportedBy]
           ,[ReportedOn]
           ,[EventDate]
           --,[EventTime]
           ,[EmployeeId]
           ,[JobTitle]
           ,[Shift]
           ,[WhatHappened]
           ,[IsInjury]
           ,[IsIllness]
           ,[HoursWorkedPrior]
           ,[InitialCategory]
           ,[ResultingCategory]
           ,[Division]
           ,[Site]
           ,[Area]
           ,[Department]
           ,[LocaleRegion]
           ,[LocaleSite]
           ,[LocalePlant]
           ,[LocalePlantArea]
           ,[WorkEnvironment]
           ,[NatureOfInjury]
           ,[BodyPart]
           ,[FirstAidType]
           ,[OffPlantMedicalFacility]
           ,[MaterialInvolved]
           ,[EquipmentInvolved]
           ,[LostTime]
           ,[FirstAid]
           ,[Transported]
           ,[ER]
           ,[RecordedOnVideo]
           ,[CameraId]
           ,[VideoStartRef]
           ,[VideoEndRef]
           ,[DepartmentId]
           ,[LocaleId]
           ,[CreatedOn]
           ,[CreatedBy]
           ,[ModifiedOn]
           ,[ModifiedBy])
     select [EventType]
           ,'Draft'
           ,[ReportedBy]
           ,[ReportedOn]
           ,[EventDate]
           --,[EventTime]
           ,[EmployeeId]
           ,[JobTitle]
           ,[Shift]
           ,[WhatHappened]
           ,[IsInjury]
           ,[IsIllness]
           ,[HoursWorkedPrior]
           ,[InitialCategory]
           ,[ResultingCategory]
           ,[Division]
           ,[Site]
           ,[Area]
           ,[Department]
           ,[LocaleRegion]
           ,[LocaleSite]
           ,[LocalePlant]
           ,[LocalePlantArea]
           ,[WorkEnvironment]
           ,[NatureOfInjury]
           ,[BodyPart]
           ,[FirstAidType]
           ,[OffPlantMedicalFacility]
           ,[MaterialInvolved]
           ,[EquipmentInvolved]
           ,[LostTime]
           ,[FirstAid]
           ,[Transported]
           ,[ER]
           ,[RecordedOnVideo]
           ,[CameraId]
           ,[VideoStartRef]
           ,[VideoEndRef]
           ,[DepartmentId]
           ,[LocaleId]
           ,[CreatedOn]
           ,[CreatedBy]
           ,[ModifiedOn]
           ,[ModifiedBy]
		from SafetyEvents  e
		where len(e.WhatHappened) > 1500
END
GO
