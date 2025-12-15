# Advanced markdown fixer

Write-Host "Fixing remaining markdown issues..." -ForegroundColor Cyan

$testingFile = "d:\college project showcase project\TESTING_GUIDE.md"

$content = Get-Content $testingFile -Raw

# Fix MD034: Wrap bare URLs in angle brackets
$content = $content -replace '"(https?://[^"]+)"', '<$1>'

# Fix MD032: Add blank lines before and after lists
# This is complex - let's process line by line
$lines = $content -split "`r?`n"
$newLines = [System.Collections.ArrayList]@()
$inList = $false

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    $prevLine = if ($i -gt 0) { $lines[$i-1] } else { "" }
    $nextLine = if ($i -lt $lines.Count-1) { $lines[$i+1] } else { "" }
    
    $isListItem = $line -match '^\s*[-\d✅✓]' -or $line -match '^\s*\d+\.'
    $prevIsListItem = $prevLine -match '^\s*[-\d✅✓]' -or $prevLine -match '^\s*\d+\.'
    $nextIsListItem = $nextLine -match '^\s*[-\d✅✓]' -or $nextLine -match '^\s*\d+\.'
    
    # Add blank line before list starts
    if ($isListItem -and -not $prevIsListItem -and $prevLine -ne "" -and $prevLine -notmatch '^\s*$') {
        [void]$newLines.Add("")
    }
    
    [void]$newLines.Add($line)
    
    # Add blank line after list ends
    if ($isListItem -and -not $nextIsListItem -and $nextLine -ne "" -and $nextLine -notmatch '^\s*$' -and $nextLine -notmatch '^---') {
        [void]$newLines.Add("")
    }
}

$content = $newLines -join "`r`n"

# Save
$content | Set-Content $testingFile -NoNewline

Write-Host "Fixed TESTING_GUIDE.md" -ForegroundColor Green
Write-Host "Done!" -ForegroundColor Cyan
