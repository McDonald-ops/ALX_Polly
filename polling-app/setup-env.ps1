# PowerShell script to set up environment variables for the polling app
# Run this script in the polling-app directory

Write-Host "Setting up environment variables for SnapAPI Polling App..." -ForegroundColor Green

# Create .env.local file with Supabase credentials
$envContent = @"
# Supabase Configuration
# Get these values from your Supabase project dashboard
NEXT_PUBLIC_SUPABASE_URL=https://eohllhagsldzstxqnehx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvaGxsaGFnc2xkenN0eHFuZWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzAxNTAsImV4cCI6MjA3MjA0NjE1MH0.1v3oJFL2nLK8e5miOi4_a9MIrGvH6uCXhzeN4D22bBs
"@

# Write the content to .env.local
$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "✅ Environment variables created in .env.local" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Set up your Supabase database using the schema in supabase-schema.sql" -ForegroundColor White
Write-Host "2. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host "3. Visit http://localhost:3000 to test the app" -ForegroundColor White
