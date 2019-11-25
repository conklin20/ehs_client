

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
	@SupervisorId nvarchar(50), --Not being saved to the event record, but using it to insert into the PeopleInvolved table
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
	
	declare @RoleId int

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

			--Insert the Supervisor PeopleInvolved record 
			if not exists(select * from PeopleInvolved p join HierarchyAttributes ha on ha.HierarchyAttributeId = p.RoleId where p.EventId = @NewEventId and ha.[Key] = 'Employee Involvement' and ha.[Value] = 'Supervisor')
			begin 				
				if(@SupervisorId is not null)
				begin 
					set @RoleId = (select ha.HierarchyAttributeId from HierarchyAttributes ha where ha.[Key] = 'Employee Involvement' and ha.[Value] = 'Supervisor')
					insert into PeopleInvolved (RoleId, EventId, EmployeeId, Comments)
					values (@RoleId, @NewEventId, @SupervisorId, 'Auto-generated from step 3')
				end
			end

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

		
		--Insert the Supervisor PeopleInvolved record 
		if not exists(select PeopleInvolvedId from PeopleInvolved p join HierarchyAttributes ha on ha.HierarchyAttributeId = p.RoleId where p.EventId = @EventId  and ha.[Key] = 'Employee Involvement' and ha.[Value] = 'Supervisor')
		begin 				
			if(@SupervisorId is not null)
			begin 	
				set @RoleId = (select ha.HierarchyAttributeId from HierarchyAttributes ha where ha.[Key] = 'Employee Involvement' and ha.[Value] = 'Supervisor')
				insert into PeopleInvolved (RoleId, EventId, EmployeeId, Comments)
				values (@RoleId, @EventId, @SupervisorId, 'Auto-generated from step 3')
			end
		end
	end
END