$data = Import-Csv 'exercises_mapping.csv'
$results = $data | Where-Object { 
    $_.name -match 'fly' -or 
    $_.name -match 'butterfly' -or
    $_.name -match 'lateral raise' -or
    $_.name -match 'pulldown' -or
    $_.name -match 'leg press' -or
    $_.name -match 'extension' -or
    $_.name -match 'military press' -or
    $_.name -match 'dip' -or
    $_.name -match 'peck deck' -or
    $_.name -match 'cross'
} | Select-Object id, name, equipment

$results | ConvertTo-Json | Out-File 'matched_ids_v2.json' -Encoding utf8
