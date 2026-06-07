$git = "C:\Program Files\Git\cmd\git.exe"

Write-Output "Removing upload scripts from git tracking..."
& $git rm --cached upload.ps1
& $git rm --cached upload-to-github.sh

Write-Output "Staging all changes..."
& $git add .

Write-Output "Amending commit to remove secrets..."
& $git commit --amend --no-edit

Write-Output "Force pushing to GitHub..."
& $git push -u origin main --force

Write-Output "Done!"
