# PowerShell script to fix all markdown linting issues

$files = @(
    "BUTTON_FUNCTIONALITY_GUIDE.md",
    "TESTING_GUIDE.md",
    "README.md"
)

foreach ($file in $files) {
    $path = "d:\college project showcase project\$file"
    
    if (Test-Path $path) {
        Write-Host "Processing $file..." -ForegroundColor Yellow
        
        $content = Get-Content $path -Raw
        
        # Fix MD022: Add blank lines around headings
        $content = $content -replace '([^\r\n])\r?\n(#{1,6} )', "`$1`r`n`r`n`$2"
        $content = $content -replace '(#{1,6} [^\r\n]+)\r?\n([^\r\n#])', "`$1`r`n`r`n`$2"
        
        # Fix MD026: Remove trailing punctuation from headings
        $content = $content -replace '(#{1,6} [^\r\n]+):(\r?\n)', "`$1`$2"
        
        # Fix MD032: Add blank lines around lists
        $content = $content -replace '([^\r\n-\d\s])\r?\n([-\d✅✓])', "`$1`r`n`r`n`$2"
        $content = $content -replace '(^[-\d✅✓][^\r\n]+)\r?\n([^\r\n-\d\s#])', "`$1`r`n`r`n`$2"
        
        # Fix MD031: Add blank lines around code blocks
        $content = $content -replace '([^\r\n])\r?\n(```)', "`$1`r`n`r`n`$2"
        $content = $content -replace '(```)\r?\n([^\r\n])', "`$1`r`n`r`n`$2"
        
        # Save file
        $content | Set-Content $path -NoNewline
        
        Write-Host "✓ Fixed $file" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "All markdown files processed!" -ForegroundColor Cyan
