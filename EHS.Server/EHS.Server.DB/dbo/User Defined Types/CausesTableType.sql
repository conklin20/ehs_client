CREATE TYPE [dbo].[CausesTableType] AS TABLE (
    [EventId]  INT            NOT NULL,
    [CauseId]  INT            NOT NULL,
    [Comments] NVARCHAR (MAX) NULL);

