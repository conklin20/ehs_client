CREATE TABLE [dbo].[Attributes] (
    [AttributeId]   INT           IDENTITY (1, 1) NOT NULL,
    [AttributeName] NVARCHAR (50) NULL,
    [Pattern]       NVARCHAR (50) NULL,
    [Enabled]       BIT           DEFAULT ((0)) NOT NULL,
    [ReadOnly]      BIT           DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_Attributes] PRIMARY KEY CLUSTERED ([AttributeId] ASC)
);

