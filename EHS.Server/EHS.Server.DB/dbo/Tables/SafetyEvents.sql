CREATE TABLE [dbo].[SafetyEvents] (
    [EventId]                 INT            IDENTITY (1, 1) NOT NULL,
    [EventType]               NVARCHAR (50)  NOT NULL,
    [EventStatus]             NVARCHAR (50)  NOT NULL,
    [ReportedBy]              NVARCHAR (50)  NOT NULL,
    [ReportedOn]              DATETIME2 (7)  NOT NULL,
    [EventDate]               DATETIME       NULL,
    [EmployeeId]              NVARCHAR (50)  NULL,
    [JobTitle]                NVARCHAR (50)  NULL,
    [Shift]                   NVARCHAR (50)  NULL,
    [WhatHappened]            NVARCHAR (MAX) NULL,
    [IsInjury]                BIT            NULL,
    [IsIllness]               BIT            NULL,
    [HoursWorkedPrior]        DECIMAL (3, 1) NULL,
    [InitialCategory]         NVARCHAR (50)  NULL,
    [ResultingCategory]       NVARCHAR (50)  NULL,
    [Division]                NVARCHAR (50)  NULL,
    [Site]                    NVARCHAR (50)  NULL,
    [Area]                    NVARCHAR (50)  NULL,
    [Department]              NVARCHAR (50)  NULL,
    [LocaleRegion]            NVARCHAR (50)  NULL,
    [LocaleSite]              NVARCHAR (50)  NULL,
    [LocalePlant]             NVARCHAR (50)  NULL,
    [LocalePlantArea]         NVARCHAR (50)  NULL,
    [WorkEnvironment]         NVARCHAR (50)  NULL,
    [NatureOfInjury]          NVARCHAR (50)  NULL,
    [BodyPart]                NVARCHAR (50)  NULL,
    [FirstAidType]            NVARCHAR (50)  NULL,
    [OffPlantMedicalFacility] NVARCHAR (50)  NULL,
    [MaterialInvolved]        NVARCHAR (50)  NULL,
    [EquipmentInvolved]       NVARCHAR (50)  NULL,
    [LostTime]                BIT            NULL,
    [FirstAid]                BIT            NULL,
    [Transported]             BIT            NULL,
    [ER]                      BIT            NULL,
    [PassedPOET]              BIT            NULL,
    [RecordedOnVideo]         BIT            NULL,
    [CameraId]                INT            NULL,
    [VideoStartRef]           DATETIME2 (7)  NULL,
    [VideoEndRef]             DATETIME2 (7)  NULL,
    [DepartmentId]            INT            CONSTRAINT [DF__SafetyEve__Depar__74AE54BC] DEFAULT ((0)) NULL,
    [LocaleId]                INT            CONSTRAINT [DF__SafetyEve__Local__75A278F5] DEFAULT ((0)) NULL,
    [CreatedOn]               DATETIME2 (7)  NOT NULL,
    [CreatedBy]               NVARCHAR (50)  NOT NULL,
    [ModifiedOn]              DATETIME2 (7)  NOT NULL,
    [ModifiedBy]              NVARCHAR (50)  NOT NULL,
    [LegacyIncidentId]        INT            NULL,
    CONSTRAINT [PK_SafetyEvents] PRIMARY KEY CLUSTERED ([EventId] ASC)
);






GO



-- =============================================
-- Author:		CC
-- Create date: 10/19/2019
-- Description:	Inserts record into app.AuditLog
-- =============================================
CREATE TRIGGER [dbo].[SafetyEventsAudit]
   ON  [dbo].[SafetyEvents]
   AFTER DELETE , INSERT, UPDATE
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--UPDATE
	if exists(select * from inserted) and exists(select * from deleted) 
	begin
		insert into app.AuditLog
		--( TimestampUtc, EventType, TableRef, RecordId, Record, UserId ) 	 
		select GETUTCDATE()
				, 'UPDATE'
				, 'dbo.SafetyEvents'
				, i.EventId
				, concat('eventId: ',cast(i.EventId as nvarchar),'|',
						'eventType: ', i.EventType, '|',
						'eventStatus: ', i.EventStatus, '|',
						'reportedBy: ', i.ReportedBy,'|',
						'reportedOn: ',cast(i.ReportedOn as nvarchar),'|',
						'eventDate: ',cast(i.eventDate as nvarchar),'|',
						'employeeId: ', i.EmployeeId,'|',
						'jobTitle: ', i.JobTitle,'|',
						'shift: ', i.shift,'|',
						'whatHappened: ', i.whatHappened,'|',
						'isInjury: ', cast(i.IsInjury as nvarchar),'|',
						'isIllness: ', cast(i.IsIllness as nvarchar),'|',
						'hourWorkedPrior: ', i.HoursWorkedPrior,'|',
						'initialCategory: ', i.InitialCategory,'|',
						'resultingCategory: ', i.ResultingCategory,'|',
						'division: ', i.Division,'|',
						'site: ', i.Site,'|',
						'area: ', i.Area,'|',
						'department: ', i.Department,'|',
						'localeRegion: ', i.LocaleRegion,'|',
						'localeSite: ', i.LocaleSite,'|',
						'localePlant: ', i.LocalePlant,'|',
						'localePlantArea: ', i.LocalePlantArea,'|',
						'workEnvironment: ', i.WorkEnvironment,'|',
						'natureOfInjury: ', i.NatureOfInjury,'|',
						'bodyPart: ', i.BodyPart,'|',
						'firstAidType: ', i.FirstAidType,'|',
						'offPlantMedicalFacility: ', i.OffPlantMedicalFacility,'|',
						'materialInvolved: ', i.MaterialInvolved,'|',
						'equipmentInvolved: ', i.EquipmentInvolved,'|',
						'lostTime: ', i.LostTime,'|',
						'firstAid: ', i.FirstAid,'|',
						'transported: ', i.Transported,'|',
						'er: ', i.ER,'|',
						'departmentId: ', cast(i.DepartmentId as nvarchar),'|',
						'localeId: ', cast(i.LocaleId as nvarchar),'|',
						'createdOn: ', cast(i.CreatedOn as nvarchar),'|',
						'createdBy: ', i.CreatedBy,'|',
						'modifiedOn: ', cast(i.ModifiedOn as nvarchar),'|',
						'modifiedBy: ', i.ModifiedBy,'|')
				, dbo.fnGetUserContext()
		from inserted i
	end
	--INSERT
	if exists(select * from inserted) and not exists(select * from deleted) 
	begin
		insert into app.AuditLog
		--( TimestampUtc, EventType, TableRef, RecordId, Record, UserId ) 	 
		select GETUTCDATE()
				, 'INSERT'
				, 'dbo.EventCauses'
				, i.EventId
				, concat('eventId: ',cast(i.EventId as nvarchar),'|',
						'eventType: ', i.EventType, '|',
						'eventStatus: ', i.EventStatus, '|',
						'reportedBy: ', i.ReportedBy,'|',
						'reportedOn: ',cast(i.ReportedOn as nvarchar),'|',
						'eventDate: ',cast(i.eventDate as nvarchar),'|',
						'employeeId: ', i.EmployeeId,'|',
						'jobTitle: ', i.JobTitle,'|',
						'shift: ', i.shift,'|',
						'whatHappened: ', i.whatHappened,'|',
						'isInjury: ', cast(i.IsInjury as nvarchar),'|',
						'isIllness: ', cast(i.IsIllness as nvarchar),'|',
						'hourWorkedPrior: ', i.HoursWorkedPrior,'|',
						'initialCategory: ', i.InitialCategory,'|',
						'resultingCategory: ', i.ResultingCategory,'|',
						'division: ', i.Division,'|',
						'site: ', i.Site,'|',
						'area: ', i.Area,'|',
						'department: ', i.Department,'|',
						'localeRegion: ', i.LocaleRegion,'|',
						'localeSite: ', i.LocaleSite,'|',
						'localePlant: ', i.LocalePlant,'|',
						'localePlantArea: ', i.LocalePlantArea,'|',
						'workEnvironment: ', i.WorkEnvironment,'|',
						'natureOfInjury: ', i.NatureOfInjury,'|',
						'bodyPart: ', i.BodyPart,'|',
						'firstAidType: ', i.FirstAidType,'|',
						'offPlantMedicalFacility: ', i.OffPlantMedicalFacility,'|',
						'materialInvolved: ', i.MaterialInvolved,'|',
						'equipmentInvolved: ', i.EquipmentInvolved,'|',
						'lostTime: ', i.LostTime,'|',
						'firstAid: ', i.FirstAid,'|',
						'transported: ', i.Transported,'|',
						'er: ', i.ER,'|',
						'departmentId: ', cast(i.DepartmentId as nvarchar),'|',
						'localeId: ', cast(i.LocaleId as nvarchar),'|',
						'createdOn: ', cast(i.CreatedOn as nvarchar),'|',
						'createdBy: ', i.CreatedBy,'|',
						'modifiedOn: ', cast(i.ModifiedOn as nvarchar),'|',
						'modifiedBy: ', i.ModifiedBy,'|')
				, dbo.fnGetUserContext()
		from inserted i
	end
	--DELETE
	if exists(select * from deleted) and not exists(select * from inserted) 
	begin
		insert into app.AuditLog
		--( TimestampUtc, EventType, TableRef, RecordId, Record, UserId ) 	 
		select GETUTCDATE()
				, 'DELETE'
				, 'dbo.EventCauses'
				, d.EventId
				, concat('eventId: ',cast(d.EventId as nvarchar),'|',
						'eventType: ', d.EventType, '|',
						'eventStatus: ', d.EventStatus, '|',
						'reportedBy: ', d.ReportedBy,'|',
						'reportedOn: ',cast(d.ReportedOn as nvarchar),'|',
						'eventDate: ',cast(d.eventDate as nvarchar),'|',
						'employeeId: ', d.EmployeeId,'|',
						'jobTitle: ', d.JobTitle,'|',
						'shift: ', d.shift,'|',
						'whatHappened: ', d.whatHappened,'|',
						'isInjury: ', cast(d.IsInjury as nvarchar),'|',
						'isIllness: ', cast(d.IsIllness as nvarchar),'|',
						'hourWorkedPrior: ', d.HoursWorkedPrior,'|',
						'initialCategory: ', d.InitialCategory,'|',
						'resultingCategory: ', d.ResultingCategory,'|',
						'division: ', d.Division,'|',
						'site: ', d.Site,'|',
						'area: ', d.Area,'|',
						'department: ', d.Department,'|',
						'localeRegion: ', d.LocaleRegion,'|',
						'localeSite: ', d.LocaleSite,'|',
						'localePlant: ', d.LocalePlant,'|',
						'localePlantArea: ', d.LocalePlantArea,'|',
						'workEnvironment: ', d.WorkEnvironment,'|',
						'natureOfInjury: ', d.NatureOfInjury,'|',
						'bodyPart: ', d.BodyPart,'|',
						'firstAidType: ', d.FirstAidType,'|',
						'offPlantMedicalFacility: ', d.OffPlantMedicalFacility,'|',
						'materialInvolved: ', d.MaterialInvolved,'|',
						'equipmentInvolved: ', d.EquipmentInvolved,'|',
						'lostTime: ', d.LostTime,'|',
						'firstAid: ', d.FirstAid,'|',
						'transported: ', d.Transported,'|',
						'er: ', d.ER,'|',
						'departmentId: ', cast(d.DepartmentId as nvarchar),'|',
						'localeId: ', cast(d.LocaleId as nvarchar),'|',
						'createdOn: ', cast(d.CreatedOn as nvarchar),'|',
						'createdBy: ', d.CreatedBy,'|',
						'modifiedOn: ', cast(d.ModifiedOn as nvarchar),'|',
						'modifiedBy: ', d.ModifiedBy,'|')
				, dbo.fnGetUserContext()
		from deleted d
	end
	
END