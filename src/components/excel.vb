' --- Fonction sécurisée pour lire la couleur de police ---
Private Function GetSafeFontColor(cell As Range) As Long
    On Error GoTo Erreur
    If Not cell Is Nothing Then
        If IsNumeric(cell.Font.Color) Then
            GetSafeFontColor = CLng(cell.Font.Color)
            Exit Function
        End If
    End If
Erreur:
    GetSafeFontColor = -1 ' Code couleur invalide
End Function

' --- Macro principale ---
Sub TransformerTableau_ParCouleurs()
    Dim wsSrc As Worksheet, wsDest As Worksheet
    Dim i As Long, lastRow As Long, destRow As Long
    Dim currentCategorie As String, currentType As String
    Dim colorValue As Long
    Dim matText As Variant
    Dim val2 As Variant, val3 As Variant, val4 As Variant

    ' === Initialisation des feuilles ===
    On Error Resume Next
    Set wsSrc = ThisWorkbook.Worksheets("Materiaux")
    Set wsDest = ThisWorkbook.Worksheets("Feuil2")
    On Error GoTo 0

    If wsSrc Is Nothing Or wsDest Is Nothing Then
        MsgBox "Les feuilles 'Materiaux' ou 'Feuil2' sont introuvables.", vbCritical
        Exit Sub
    End If

    ' === Réinitialiser la feuille de destination ===
    wsDest.Cells.Clear
    wsDest.Range("A1:F1").Value = Array("Categorie", "Type", "Materiaux", "Unites", "Pu", "CoutTrans")
    destRow = 2

    lastRow = wsSrc.Cells(wsSrc.Rows.Count, "A").End(xlUp).Row

    ' === Boucle principale ===
    For i = 2 To lastRow
        matText = wsSrc.Cells(i, 1).Value
        val2 = wsSrc.Cells(i, 2).Value
        val3 = wsSrc.Cells(i, 3).Value
        val4 = wsSrc.Cells(i, 4).Value

        ' Lire la couleur de façon sécurisée
        colorValue = GetSafeFontColor(wsSrc.Cells(i, 1))

        ' Vérifier qu’il n’y a pas d’erreur dans les cellules
        If Not IsError(matText) And Not IsError(val2) And Not IsError(val3) Then
            ' === Ligne de Catégorie ou Type ===
            If matText <> "" And val2 = "" And val3 = "" Then
                If colorValue = RGB(255, 0, 0) Then
                    currentCategorie = matText
                ElseIf colorValue = RGB(0, 102, 204) _
                    Or colorValue = RGB(0, 112, 192) _
                    Or colorValue = RGB(0, 0, 255) _
                    Or colorValue = RGB(0, 176, 240) Then
                    currentType = matText
                End If

            ' === Ligne de données ===
            ElseIf matText <> "" And val2 <> "" Then
                wsDest.Cells(destRow, 1).Value = currentCategorie
                wsDest.Cells(destRow, 2).Value = currentType
                wsDest.Cells(destRow, 3).Value = matText
                wsDest.Cells(destRow, 4).Value = val2
                wsDest.Cells(destRow, 5).Value = val3
                wsDest.Cells(destRow, 6).Value = val4
                destRow = destRow + 1
            End If
        End If
    Next i

    ' === Ajouter un filtre automatique si lignes remplies ===
    If destRow > 2 Then
        wsDest.Range("A1:F" & destRow - 1).AutoFilter
    End If

    MsgBox "Transformation réalisée avec succès !", vbInformation
End Sub
