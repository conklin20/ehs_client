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
/****** Object:  StoredProcedure [dbo].[spSafetyEventAddOrUpdate]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[spSafetyEventAddOrUpdate]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[spSafetyEventAddOrUpdate]
GO
/****** Object:  StoredProcedure [dbo].[spSafetyEventAddOrUpdate]    Script Date: 11/8/2019 10:32:39 AM ******/
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
CREATE PROCEDURE [dbo].[spSafetyEventAddOrUpdate] 
	@EventId	int = null,
	@EventType	nvarchar(50),
	@EventStatus	nvarchar(50),
	@ReportedBy	nvarchar(50),
	@ReportedOn	datetime2,
	@EventDate	datetime,
	--@EventTime	time(7),
	@EmployeeId	nvarchar(50),
	@JobTitle	nvarchar(50),
	@Shift	nvarchar(50),
	@WhatHappened	nvarchar(max),
	@IsInjury	bit,
	@IsIllness	bit,
	@HoursWorkedPrior	decimal(3,1),
	@InitialCategory	nvarchar(50),
	@ResultingCategory	nvarchar(50),
	@WorkEnvironment	nvarchar(50),
	@NatureOfInjury	nvarchar(50),
	@BodyPart	nvarchar(50),
	@FirstAidType	nvarchar(50),
	@OffPlantMedicalFacility	nvarchar(50),
	@MaterialInvolved	nvarchar(50),
	@EquipmentInvolved	nvarchar(50),
	@LostTime	bit,
	@FirstAid	bit,
	@Transported	bit,
	@ER	bit,
	@RecordedOnVideo	bit,
	@CameraId	int,
	@VideoStartRef	datetime2,
	@VideoEndRef	datetime2,
	@DepartmentId	int,
	@LocaleId	int,
	@UserId nvarchar(50),
	@NewEventId int output 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext @UserId

	declare
		@Division nvarchar(50)			= (select h.HierarchyName from dbo.fnGetHierarchySinglePath(@DepartmentId) h join HierarchyLevels l on h.HierarchyLevelId = l.HierarchyLevelId where l.HierarchyLevel = 2),
		@Site nvarchar(50)				= (select h.HierarchyName from dbo.fnGetHierarchySinglePath(@DepartmentId) h join HierarchyLevels l on h.HierarchyLevelId = l.HierarchyLevelId where l.HierarchyLevel = 3),
		@Area nvarchar(50)				= (select h.HierarchyName from dbo.fnGetHierarchySinglePath(@DepartmentId) h join HierarchyLevels l on h.HierarchyLevelId = l.HierarchyLevelId where l.HierarchyLevel = 4),
		@Department	nvarchar(50)		= (select h.HierarchyName from dbo.fnGetHierarchySinglePath(@DepartmentId) h join HierarchyLevels l on h.HierarchyLevelId = l.HierarchyLevelId where l.HierarchyLevel = 5),
		@LocaleRegion nvarchar(50)		= (select h.HierarchyName from dbo.fnGetHierarchySinglePath(@LocaleId) h join HierarchyLevels l on h.HierarchyLevelId = l.HierarchyLevelId where l.HierarchyLevel = 2),
		@LocaleSite	nvarchar(50)		= (select h.HierarchyName from dbo.fnGetHierarchySinglePath(@LocaleId) h join HierarchyLevels l on h.HierarchyLevelId = l.HierarchyLevelId where l.HierarchyLevel = 3),
		@LocalePlant nvarchar(50)		= (select h.HierarchyName from dbo.fnGetHierarchySinglePath(@LocaleId) h join HierarchyLevels l on h.HierarchyLevelId = l.HierarchyLevelId where l.HierarchyLevel = 4),
		@LocalePlantArea nvarchar(50)	= (select h.HierarchyName from dbo.fnGetHierarchySinglePath(@LocaleId) h join HierarchyLevels l on h.HierarchyLevelId = l.HierarchyLevelId where l.HierarchyLevel = 5)

    if(@EventId is null) 
	begin 
		print 'Insert new safety event'
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
     values
           (@EventType,
			@EventStatus,
			@ReportedBy,
			@ReportedOn,
			@EventDate,
			--@EventTime,
			@EmployeeId,
			@JobTitle,
			@Shift,
			@WhatHappened,
			@IsInjury,
			@IsIllness,
			@HoursWorkedPrior,
			@InitialCategory,
			@ResultingCategory,
			@Division,
			@Site,
			@Area,
			@Department,
			@LocaleRegion,
			@LocaleSite,
			@LocalePlant,
			@LocalePlantArea,
			@WorkEnvironment,
			@NatureOfInjury,
			@BodyPart,
			@FirstAidType,
			@OffPlantMedicalFacility,
			@MaterialInvolved,
			@EquipmentInvolved,
			@LostTime,
			@FirstAid,
			@Transported,
			@ER,
			@RecordedOnVideo,
			@CameraId,
			@VideoStartRef,
			@VideoEndRef,
			@DepartmentId,
			@LocaleId,
            GETUTCDATE(),
            @UserId,
            GETUTCDATE(),
            @UserId)

			set @NewEventId = SCOPE_IDENTITY()
			return @NewEventId
	end
	else 
	begin 
		print 'Update existing safety event'
		update SafetyEvents 
		set EventType = @EventType,
			EventStatus = @EventStatus,
			ReportedBy = @ReportedBy,
			ReportedOn = @ReportedOn,
			EventDate = @EventDate,
			--EventTime = @EventTime,
			EmployeeId = @EmployeeId,
			JobTitle = @JobTitle,
			Shift = @Shift,
			WhatHappened = @WhatHappened,
			IsInjury = @IsInjury,
			IsIllness = @IsIllness,
			HoursWorkedPrior = @HoursWorkedPrior,
			InitialCategory = @InitialCategory,
			ResultingCategory = @ResultingCategory,
			Division = @Division,
			Site = @Site,
			Area = @Area,
			Department = @Department,
			LocaleRegion = @LocaleRegion,
			LocaleSite = @LocaleSite,
			LocalePlant = @LocalePlant,
			LocalePlantArea = @LocalePlantArea,
			WorkEnvironment = @WorkEnvironment,
			NatureOfInjury = @NatureOfInjury,
			BodyPart = @BodyPart,
			FirstAidType = @FirstAidType,
			OffPlantMedicalFacility = @OffPlantMedicalFacility,
			MaterialInvolved = @MaterialInvolved,
			EquipmentInvolved = @EquipmentInvolved,
			LostTime = @LostTime,
			FirstAid = @FirstAid,
			Transported = @Transported,
			ER = @ER,
			RecordedOnVideo = @RecordedOnVideo,
			CameraId = @CameraId,
			VideoStartRef = @VideoStartRef,
			VideoEndRef = @VideoEndRef,
			DepartmentId = @DepartmentId,
			LocaleId = @LocaleId,
			ModifiedOn = GETUTCDATE(),
			ModifiedBy = @UserId
		where EventId = @EventId
	end
END
GO
