
CREATE VIEW [dbo].[vMaterials]
AS

SELECT hl.HierarchyLevelName, h.HierarchyName, a.AttributeName, ha.[Key], ha.Value, h.Lft, h.Rgt
FROM  dbo.HierarchyLevels hl INNER JOIN
         dbo.Hierarchies h ON hl.HierarchyLevelId = h.HierarchyLevelId INNER JOIN
         dbo.Attributes a INNER JOIN
         dbo.HierarchyAttributes ha ON a.AttributeId = ha.AttributeId ON h.HierarchyId = ha.HierarchyId
WHERE (ha.[Key] = N'Materials')

GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPane1', @value = N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[31] 4[23] 2[11] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "Attributes"
            Begin Extent = 
               Top = 74
               Left = 697
               Bottom = 351
               Right = 1023
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "AttributeCategories"
            Begin Extent = 
               Top = 83
               Left = 148
               Bottom = 262
               Right = 518
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "Hierarchies"
            Begin Extent = 
               Top = 52
               Left = 1688
               Bottom = 506
               Right = 2021
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "HierarchyAttributes"
            Begin Extent = 
               Top = 0
               Left = 1138
               Bottom = 529
               Right = 1469
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "HierarchyCategories"
            Begin Extent = 
               Top = 102
               Left = 2265
               Bottom = 405
               Right = 2642
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 10
         Width = 284
         Width = 1965
         Width = 1808
         Width = 2063
         Width = 1343
         Width = 1965
         Width = 2093
         Width = 923
         Width = 750
         Width = 750
      End
   End
   Begin CriteriaPane = 
      Begin C', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'vMaterials';


GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPane2', @value = N'olumnWidths = 11
         Column = 2130
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'vMaterials';


GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPaneCount', @value = 2, @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'vMaterials';

