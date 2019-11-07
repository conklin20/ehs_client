-- =============================================
-- Author:		CC
-- Create date: 07/27/2019
-- Description:	script for migrating legacy incidents over to new database
-- =============================================
CREATE PROCEDURE [dbo].[spLegacyIncidentMigration]
	@TruncateTable bit = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
		
	--set Context_Info for the user passed into the proc so the Audit triggers can capture who's making the change 
	exec dbo.spSetUserContext 'sysmigration'

	declare @utcoffset int = -8 --converting any dates in the legacy system to UTC

	if(@TruncateTable = 1)
	begin 
		--create temp tables for non-legacy data
		if(object_id('tempdb..#data_migration_events') is not null) drop table #data_migration_events
		if(object_id('tempdb..#data_migration_people') is not null) drop table #data_migration_people
		if(object_id('tempdb..#data_migration_actions') is not null) drop table #data_migration_actions
		if(object_id('tempdb..#data_migration_approvals') is not null) drop table #data_migration_approvals
		if(object_id('tempdb..#data_migration_files') is not null) drop table #data_migration_files

		select * 
		into #data_migration_events 
		from SafetyEvents
		where LegacyIncidentId is null

		select p.*
		into #data_migration_people
		from PeopleInvolved p 
			 join #data_migration_events e on e.EventId = p.EventId
			 
		select a.*
		into #data_migration_actions
		from Actions a
			 join #data_migration_events e on e.EventId = a.EventId
			 
		select a.*
		into #data_migration_approvals
		from Approvals a
			 join #data_migration_actions ac on ac.ActionId = a.ActionId
			 
		select ef.*
		into #data_migration_files
		from EventFiles ef
			 join #data_migration_events e on e.EventId = ef.EventId
		
		
		truncate table SafetyEvents
		truncate table PeopleInvolved
		truncate table Actions
		truncate table Approvals
		truncate table EventFiles

		--RE-insert data 
		set identity_insert SafetyEvents on 
		insert into SafetyEvents(EventId, EventType,EventStatus,ReportedBy,ReportedOn,EventDate,EmployeeId,JobTitle,Shift,WhatHappened,IsInjury,IsIllness,HoursWorkedPrior,InitialCategory,ResultingCategory,Division,Site,Area,Department,LocaleRegion,LocaleSite,LocalePlant,LocalePlantArea,WorkEnvironment,NatureOfInjury,BodyPart,FirstAidType,OffPlantMedicalFacility,MaterialInvolved,EquipmentInvolved,LostTime,FirstAid,Transported,ER,PassedPOET,RecordedOnVideo,CameraId,VideoStartRef,VideoEndRef,DepartmentId,LocaleId,CreatedOn,CreatedBy,ModifiedOn,ModifiedBy,LegacyIncidentId)
		select EventId, EventType,EventStatus,ReportedBy,ReportedOn,EventDate,EmployeeId,JobTitle,Shift,WhatHappened,IsInjury,IsIllness,HoursWorkedPrior,InitialCategory,ResultingCategory,Division,Site,Area,Department,LocaleRegion,LocaleSite,LocalePlant,LocalePlantArea,WorkEnvironment,NatureOfInjury,BodyPart,FirstAidType,OffPlantMedicalFacility,MaterialInvolved,EquipmentInvolved,LostTime,FirstAid,Transported,ER,PassedPOET,RecordedOnVideo,CameraId,VideoStartRef,VideoEndRef,DepartmentId,LocaleId,CreatedOn,CreatedBy,ModifiedOn,ModifiedBy,LegacyIncidentId
		from #data_migration_events
		set identity_insert SafetyEvents off
		
		set identity_insert PeopleInvolved on 
		insert into PeopleInvolved(PeopleInvolvedId,RoleId,EventId,EmployeeId,Comments)
		select PeopleInvolvedId,RoleId,EventId,EmployeeId,Comments
		from #data_migration_people
		set identity_insert PeopleInvolved off
		
		set identity_insert Actions on 
		insert into Actions(ActionId,EventId,EventType,AssignedTo,ActionToTake,ActionType,DueDate,CompletionDate,ApprovalDate,CreatedOn,CreatedBy,ModifiedOn,ModifiedBy)
		select ActionId,EventId,EventType,AssignedTo,ActionToTake,ActionType,DueDate,CompletionDate,ApprovalDate,CreatedOn,CreatedBy,ModifiedOn,ModifiedBy
		from #data_migration_actions
		set identity_insert Actions off
		
		set identity_insert Approvals on 
		insert into Approvals(ApprovalId,ActionId,ApprovalLevelId,ApprovedBy,ApprovedOn,Notes)
		select ApprovalId,ActionId,ApprovalLevelId,ApprovedBy,ApprovedOn,Notes
		from #data_migration_approvals
		set identity_insert Approvals off
		
		set identity_insert EventFiles on 
		insert into EventFiles(EventFileId,EventId,UserId,ServerFileName,UserFileName,CreatedOn)
		select EventFileId,EventId,UserId,ServerFileName,UserFileName,CreatedOn
		from #data_migration_files
		set identity_insert EventFiles off
	end
	   
	--incidents
	insert into SafetyEvents 
	select 
		'Safety Incident'
		,case when legi.Completed = 1 then 'Closed' else 'Open' end as EventStatus
		,case when legi.SubmittedBy = 0 then 'N/A' else cast(legi.SubmittedBy as varchar) end as ReportedBy
		,dateadd(hour, @utcoffset, cast(legi.SubmittedDate as datetime2)) as ReportedOn
		,dateadd(hour, @utcoffset, cast(legi.IncidentDate as datetime2)) as EventDate
		,legi.eNumber as EmployeeId
		,legj.JobDescription as JobTitle
		,legi.IncidentShift as Shift
		,legi.Addendum as WhatHappened
		,case when legi.InjuryId = 73 then 0 else 1 end as IsInjury
		,0 as IsIllness
		,legi.HoursWorked as HoursWorkedPrior
		,legc.CategoryDesc as InitialCategory
		,legc.CategoryDesc as ResultingCategory
		,'Ammo' as Divison
		,'Lewiston (CCI/Speer)' as Site
		,newha.HierarchyName as Area
		,newhd.HierarchyName as Department
		,'PNW' as LocaleRegion
		,'Lewiston' as LocaleSite
		,'Main Plant' as LocalePlant
		,'N/A' as LocalePlantArea
		,legwe.WorkEnvironment as WorkEnviornment
		,legnoi.Description as NatureOfInjury
		,legbp.Description as BodyPart
		,legfa.Description as FirstAidType
		,isnull(legopmf.Description, 'None') as OffPlantMedicalFacility
		,legm.Description as MaterialInvolved
		,lege.Description as EquipmentInvolved
		,isnull(legi.LostTime, 0) as LostTime
		,case when legfa.Description is null then 0 else 1 end as FirstAid
		,legi.Transported as Transported
		,0 as ER
		,0 as PassedPoet
		,0 as RecordedOnVideo
		,null as CameraId
		,null as VideoStartRef
		,null as VideoEndRef
		,newhd.HierarchyId as DepartmentId
		,dbo.fnGetHierarchyIdByName('Lewiston') as LocaleId
		,GETUTCDATE() as CreatedOn
		,'sysmigration' as CreatedBy
		,GETUTCDATE() as ModifiedOn
		,'sysmigration' as ModifiedBy
		,legi.IncidentID as LegacyIncidentId
	from Incident.dbo.Incident legi
			join Incident.dbo.PlantJob legj on legj.PlantJobId = legi.JobId
			join Incident.dbo.Category legc on legc.CategoryID = legi.CategoryID 
			join Hierarchies newha on newha.HierarchyId = dbo.fnSiteAreaTOHierarchyIdMapper(legi.IncidentDept) and newha.HierarchyLevelId = 501
			join Hierarchies newhd on newhd.HierarchyId = dbo.fnSiteAreaDeptTOHierarchyIdMapper(legi.IncidentDept) and newhd.HierarchyLevelId = 601
			left join Incident.dbo.WorkEnvironment legwe on legwe.WorkEnviromentID = legi.WorkEnviromentID 
			left join Incident.dbo.AttributeDetail legacc on legacc.AttributeID = legi.AccidentId and legacc.TypeID = 1 --How Injured
			left join Incident.dbo.AttributeDetail legbp on legbp.AttributeID = legi.BodyPartId and legbp.TypeID = 2 --Body Part
			left join Incident.dbo.AttributeDetail legnoi on legnoi.AttributeID = legi.InjuryId and legnoi.TypeID = 3 --Injury Type
			left join Incident.dbo.AttributeDetail legopmf on legopmf.AttributeID = legi.OffPlantId and legopmf.TypeID = 5 --Off Plant Medical Facility
			left join Incident.dbo.AttributeDetail legfa on legfa.AttributeID = legi.FirstAidId and legfa.TypeID = 8 --First Aid
			left join Incident.dbo.Material legm on legm.MaterialId = legi.MaterialId 
			left join Incident.dbo.Equipment lege on lege.EquipmentId = legi.EquipmentId 
			--left join Incident.dbo.vCauses legroot on legroot.IncidentID = legi.IncidentID and legroot.CauseType = 'Root Cause'
			--left join Incident.dbo.vCauses legcf on legcf.IncidentID = legi.IncidentID and legcf.CauseType = 'Contributing Factor'
			--left join Incident.dbo.vCauses legic on legic.IncidentID = legi.IncidentID and legic.CauseType = 'Immediate Cause'
	where dbo.fnSiteAreaDeptTOHierarchyIdMapper(legi.IncidentDept) != -1

	--people involved 
	insert into PeopleInvolved 
	select 
		case when legrt.RoleDesc = 'InvestigationTeam' then 179
			 when legrt.RoleDesc = 'Supervisor' then 180
			 when legrt.RoleDesc = 'Witness' then 181
			 when legrt.RoleDesc = 'Other' then 182
			 else -1 end as RoleId
		,se.EventId
		,legip.eNumber
		,legip.Comments
	from Incident.dbo.IncidentPerson legip
		join Incident.dbo.RoleType legrt on legrt.RoleID = legip.RoleID
		join SafetyEvents se on se.LegacyIncidentId = legip.IncidentID

	--actions 
	declare @eventId int, @assignedTo nvarchar(50), @actionToTake nvarchar(max), @actionType nvarchar(50), @dueDate datetime, @completionDate datetime, @approvalDate datetime, @deptApr bit, @deptAprOn datetime, @areaApr bit, @areaAprOn datetime, @safetyApr bit, @safetyAprOn datetime
	declare @newId int
	declare action_cursor CURSOR FOR 

		select 
			se.EventId
			,legad.Enumber as AssignedTo
			,legad.Action as ActionToTake
			,legat.ActionTypeDesc as ActionType
			,dateadd(hour, @utcoffset, cast(legad.ActionDate as datetime2)) as DueDate
			,dateadd(hour, @utcoffset, cast(legad.CompletionDate as datetime2)) as CompletionDate
			,case when legad.Safety_ApprovalDate is not null then dateadd(hour, @utcoffset, legad.Safety_ApprovalDate)
				  when legad.Area_ApprovalDate is not null then dateadd(hour, @utcoffset, legad.Area_ApprovalDate)
				  when legad.Dept_ApprovalDate is not null then dateadd(hour, @utcoffset, legad.Dept_ApprovalDate)
				  else null end as ApprovalDate
			,isnull(legad.Dept_Approval, 0) 
			,dateadd(hour, @utcoffset, legad.Dept_ApprovalDate) 
			,isnull(legad.Area_Approval, 0)
			,dateadd(hour, @utcoffset, legad.Area_ApprovalDate)
			,isnull(legad.Safety_Approval, 0)
			,dateadd(hour, @utcoffset, legad.Safety_ApprovalDate)
		from Incident.dbo.ActionDetails legad
			 join Incident.dbo.ActionType legat on legat.ActionTypeID = legad.ActionTypeID
			 join SafetyEvents se on se.LegacyIncidentId = legad.IncidentID

	open action_cursor
	fetch next from action_cursor into @eventId, @assignedTo, @actionToTake, @actionType, @dueDate, @completionDate, @approvalDate, @deptApr, @deptAprOn, @areaApr, @areaAprOn, @safetyApr, @safetyAprOn

	while @@FETCH_STATUS = 0 
	begin 
		insert into Actions
		select 
			@eventId
			,'Safety Incident'
			,@assignedTo
			,@actionToTake
			,@actionType
			,@dueDate
			,@completionDate
			,@approvalDate
			,GETUTCDATE()
			,'system'
			,GETUTCDATE()
			,'system'
		
		set @newId = (select max(ActionId) from Actions)
		
		--insert approval record for dept
		if (@deptApr = 1)
		begin 
			insert into Approvals
			select 
				@newId --ActionId
				,1	--Level
				,'N/A' --ApprovedBy
				,isnull(@deptAprOn, cast(getutcdate() as date))
				,'Legacy Apprroval Migration' --Notes
		end
		
		--insert approval record for area
		if (@areaApr = 1)
		begin
			insert into Approvals
			select 
				@newId
				,2
				,'N/A'
				,isnull(@areaAprOn, cast(getutcdate() as date))
				,'Legacy Apprroval Migration'
		end
		
		--insert approal  record for safety 
		if (@safetyApr = 1)
		begin
			insert into Approvals
			select 
				@newId
				,5
				,'N/A'
				,isnull(@safetyAprOn, cast(getutcdate() as date))
				,'Legacy Apprroval Migration'
		end	

		fetch next from action_cursor into @eventId, @assignedTo, @actionToTake, @actionType, @dueDate, @completionDate, @approvalDate, @deptApr, @deptAprOn, @areaApr, @areaAprOn, @safetyApr, @safetyAprOn
	end 
	close action_cursor
	deallocate action_cursor 

	--causes 
	--root causes
	insert into EventCauses 
	select se.EventId, ha.HierarchyAttributeId, legic.Comments
	from Incident.dbo.IncidentCause legic 
		 join Incident.dbo.AttributeDetail legad on legic.CauseId = legad.AttributeID
		 join SafetyEvents se on se.LegacyIncidentId = legic.IncidentId 
		 join HierarchyAttributes ha on ha.Value = legad.Description
	where legad.TypeID = 7	--Root Cause 
		 and ha.[Key] = 'Root Causes'

	--Contributing Factors
	insert into EventCauses 
	select se.EventId, ha.HierarchyAttributeId, legic.Comments
	from Incident.dbo.IncidentCause legic 
		 join Incident.dbo.AttributeDetail legad on legic.CauseId = legad.AttributeID
		 join SafetyEvents se on se.LegacyIncidentId = legic.IncidentId 
		 join HierarchyAttributes ha on ha.Value = legad.Description
	where legad.TypeID = 11	--Contributing Factors
		 and ha.[Key] = 'Contributing Factors'
		 
	--Immediate Causes
	insert into EventCauses 
	select se.EventId, ha.HierarchyAttributeId, legic.Comments
	from Incident.dbo.IncidentCause legic 
		 join Incident.dbo.AttributeDetail legad on legic.CauseId = legad.AttributeID
		 join SafetyEvents se on se.LegacyIncidentId = legic.IncidentId 
		 join HierarchyAttributes ha on ha.Value = legad.Description
	where legad.TypeID = 12	--Immediate Cause
		 and ha.[Key] = 'Immediate Causes'

	--files - this will only be a refrence to the file name, we're not actually migrating files over for legacy incidents 
	insert into EventFiles (EventId, UserId, ServerFileName, UserFileName, CreatedOn)
	select se.EventId, 'sysmigration', legid.Filepath, legid.DocName, getutcdate()
	from Incident.dbo.IncidentDocs legid
		 join SafetyEvents se on se.LegacyIncidentId = legid.IncidentID



END