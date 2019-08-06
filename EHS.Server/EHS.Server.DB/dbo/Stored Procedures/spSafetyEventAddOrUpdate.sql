

-- =============================================
-- Author:		CC
-- Create date: 06/29/2019
-- Description:	Add or Update operations for the SafetyEvents Table
-- Select * from dbo.SafetyEvents
-- =============================================
CREATE PROCEDURE [dbo].[spSafetyEventAddOrUpdate] 
	@SafetyEventId	int = null,
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
	@HoursWorkedPrior	tinyint,
	@InitialCategory	nvarchar(50),
	@ResultingCategory	nvarchar(50),
	@Division	nvarchar(50),
	@Site	nvarchar(50),
	@Area	nvarchar(50),
	@Department	nvarchar(50),
	@LocaleRegion	nvarchar(50),
	@LocaleSite	nvarchar(50),
	@LocalePlant	nvarchar(50),
	@LocalePlantArea	nvarchar(50),
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
	@PassedPOET	bit,
	@RecordedOnVideo	bit,
	@CameraId	int,
	@VideoStartRef	datetime2,
	@VideoEndRef	datetime2,
	@DepartmentId	int,
	@LocaleId	int,
	@UserId nvarchar(50) 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    if(@SafetyEventId is null) 
	begin 
		print 'Insert new safety event'
		INSERT INTO [dbo].[SafetyEvents]
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
           ,[PassedPOET]
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
     VALUES
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
			@PassedPOET,
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
			PassedPOET = @PassedPOET,
			RecordedOnVideo = @RecordedOnVideo,
			CameraId = @CameraId,
			VideoStartRef = @VideoStartRef,
			VideoEndRef = @VideoEndRef,
			DepartmentId = @DepartmentId,
			LocaleId = @LocaleId,
			ModifiedOn = GETUTCDATE(),
			ModifiedBy = @UserId
		where EventId = @SafetyEventId
	end
END