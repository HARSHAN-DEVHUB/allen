# Fix all markdown linting issues

Write-Host "Fixing markdown issues..." -ForegroundColor Cyan

$files = @(
    "BUTTON_FUNCTIONALITY_GUIDE.md",
    "TESTING_GUIDE.md",
    "README.md"
)

foreach ($file in $files) {
    $fullPath = Join-Path "d:\college project showcase project" $file
    
    if (Test-Path $fullPath) {
        Write-Host "Processing $file..." -ForegroundColor Yellow
        
        $lines = Get-Content $fullPath
        $newLines = [System.Collections.ArrayList]@()
        
        for ($i = 0; $i -lt $lines.Count; $i++) {
            $line = $lines[$i]
            $prevLine = if ($i -gt 0) { $lines[$i-1] } else { "" }
            $nextLine = if ($i -lt $lines.Count-1) { $lines[$i+1] } else { "" }
            
            # Add blank line before headings if needed
            if ($line -match '^#{1,6} ' -and $prevLine -ne "" -and $prevLine -notmatch '^#{1,6} ' -and $prevLine -ne "---") {
                [void]$newLines.Add("")
            }
            
            # Remove trailing colon from headings
            if ($line -match '^(#{1,6} .+):$') {
                $line = $line -replace ':$', ''
            }
            
            [void]$newLines.Add($line)
            
            # Add blank line after headings if needed
            if ($line -match '^#{1,6} ' -and $nextLine -ne "" -and $nextLine -notmatch '^#{1,6} ' -and $nextLine -ne "---") {
                if (-not ($newLines[-1] -eq "" -or $nextLine -eq "")) {
                    [void]$newLines.Add("")
                }
            }
        }
        
        $newLines | Set-Content $fullPath
        Write-Host "Fixed $file" -ForegroundColor Green
    }
}

Write-Host "Done!" -ForegroundColor Cyan
