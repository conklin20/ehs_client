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
/****** Object:  Trigger [SafetyEventsAudit]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[dbo].[SafetyEventsAudit]'))
DROP TRIGGER [dbo].[SafetyEventsAudit]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__SafetyEve__Local__75A278F5]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[SafetyEvents] DROP CONSTRAINT [DF__SafetyEve__Local__75A278F5]
END
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__SafetyEve__Depar__74AE54BC]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[SafetyEvents] DROP CONSTRAINT [DF__SafetyEve__Depar__74AE54BC]
END
GO
/****** Object:  Table [dbo].[SafetyEvents]    Script Date: 11/8/2019 10:32:39 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SafetyEvents]') AND type in (N'U'))
DROP TABLE [dbo].[SafetyEvents]
GO
/****** Object:  Table [dbo].[SafetyEvents]    Script Date: 11/8/2019 10:32:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SafetyEvents](
	[EventId] [int] IDENTITY(1,1) NOT NULL,
	[EventType] [nvarchar](50) NOT NULL,
	[EventStatus] [nvarchar](50) NOT NULL,
	[ReportedBy] [nvarchar](50) NOT NULL,
	[ReportedOn] [datetime2](7) NOT NULL,
	[EventDate] [datetime] NULL,
	[EmployeeId] [nvarchar](50) NULL,
	[JobTitle] [nvarchar](50) NULL,
	[Shift] [nvarchar](50) NULL,
	[WhatHappened] [nvarchar](max) NULL,
	[IsInjury] [bit] NULL,
	[IsIllness] [bit] NULL,
	[HoursWorkedPrior] [decimal](3, 1) NULL,
	[InitialCategory] [nvarchar](50) NULL,
	[ResultingCategory] [nvarchar](50) NULL,
	[Division] [nvarchar](50) NULL,
	[Site] [nvarchar](50) NULL,
	[Area] [nvarchar](50) NULL,
	[Department] [nvarchar](50) NULL,
	[LocaleRegion] [nvarchar](50) NULL,
	[LocaleSite] [nvarchar](50) NULL,
	[LocalePlant] [nvarchar](50) NULL,
	[LocalePlantArea] [nvarchar](50) NULL,
	[WorkEnvironment] [nvarchar](50) NULL,
	[NatureOfInjury] [nvarchar](50) NULL,
	[BodyPart] [nvarchar](50) NULL,
	[FirstAidType] [nvarchar](50) NULL,
	[OffPlantMedicalFacility] [nvarchar](50) NULL,
	[MaterialInvolved] [nvarchar](50) NULL,
	[EquipmentInvolved] [nvarchar](50) NULL,
	[LostTime] [bit] NULL,
	[FirstAid] [bit] NULL,
	[Transported] [bit] NULL,
	[ER] [bit] NULL,
	[PassedPOET] [bit] NULL,
	[RecordedOnVideo] [bit] NULL,
	[CameraId] [int] NULL,
	[VideoStartRef] [datetime2](7) NULL,
	[VideoEndRef] [datetime2](7) NULL,
	[DepartmentId] [int] NULL,
	[LocaleId] [int] NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[CreatedBy] [nvarchar](50) NOT NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](50) NOT NULL,
	[LegacyIncidentId] [int] NULL,
 CONSTRAINT [PK_SafetyEvents] PRIMARY KEY CLUSTERED 
(
	[EventId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[SafetyEvents] ADD  CONSTRAINT [DF__SafetyEve__Depar__74AE54BC]  DEFAULT ((0)) FOR [DepartmentId]
GO
ALTER TABLE [dbo].[SafetyEvents] ADD  CONSTRAINT [DF__SafetyEve__Local__75A278F5]  DEFAULT ((0)) FOR [LocaleId]
GO
/****** Object:  Trigger [dbo].[SafetyEventsAudit]    Script Date: 11/8/2019 10:32:40 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
GO
ALTER TABLE [dbo].[SafetyEvents] ENABLE TRIGGER [SafetyEventsAudit]
GO
